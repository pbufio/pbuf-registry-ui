<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PCard from '@/components/PCard.vue'
import PBadge from '@/components/PBadge.vue'
import PButton from '@/components/PButton.vue'
import PCodeBlock from '@/components/PCodeBlock.vue'
import { registryApi } from '@/services/registryApi'
import { metadataApi } from '@/services/metadataApi'

const route = useRoute()
const router = useRouter()
const protoFiles = ref([])
const dependencies = ref([])
const metadata = ref(null)
const loading = ref(true)
const loadingProtoFiles = ref(false)
const protoFilesLoaded = ref(false)
const activeTab = ref('files')
const error = ref(null)
const protoFilesError = ref(null)

const moduleName = computed(() => {
  const name = route.params.name
  return Array.isArray(name) ? name.join('/') : name
})
const tag = computed(() => route.params.tag)

const loadVersionDetails = async () => {
  loading.value = true
  error.value = null
  try {
    // Get metadata (parsed proto structure) - Level 3
    const metadataResponse = await metadataApi.getMetadata(moduleName.value, tag.value)
    metadata.value = metadataResponse

    // Get dependencies
    const depsResponse = await registryApi.getModuleDependencies(moduleName.value, tag.value)
    dependencies.value = depsResponse.dependencies || []
  } catch (err) {
    console.error('Failed to load version details:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load version details'
  } finally {
    loading.value = false
  }
}

const loadProtoFiles = async () => {
  if (protoFilesLoaded.value) return
  
  loadingProtoFiles.value = true
  protoFilesError.value = null
  try {
    // Pull module to get proto files - only when needed
    const pullResponse = await registryApi.pullModule(moduleName.value, tag.value)
    protoFiles.value = pullResponse.protofiles || []
    protoFilesLoaded.value = true
  } catch (err) {
    console.error('Failed to load proto files:', err)
    protoFilesError.value = err.response?.data?.message || err.message || 'Failed to load proto files'
  } finally {
    loadingProtoFiles.value = false
  }
}

// Watch activeTab and load proto files when Files tab is clicked
watch(activeTab, (newTab) => {
  if (newTab === 'files' && !protoFilesLoaded.value) {
    loadProtoFiles()
  }
})

onMounted(() => {
  loadVersionDetails()
  loadProtoFiles()
})
</script>

<template>
  <div class="min-h-screen bg-surface-base">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
        <p class="text-zinc-400 mt-4">Loading version details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="mb-4">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-zinc-300 font-semibold mb-2">Failed to Load Version Details</p>
          <p class="text-zinc-400">{{ error }}</p>
        </div>
        <div class="flex gap-4 justify-center">
          <PButton variant="primary" @click="loadVersionDetails">
            Retry
          </PButton>
          <PButton variant="secondary" @click="$router.push(`/modules/${moduleName}`)">
            Back to Module
          </PButton>
        </div>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Header -->
        <div class="mb-8">
          <PButton variant="secondary" @click="$router.push(`/modules/${moduleName}`)" class="mb-4">
            ← Back to Module
          </PButton>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-4xl font-bold tracking-tight font-mono">{{ moduleName }}</h1>
            <PBadge variant="brand">{{ tag }}</PBadge>
          </div>
        </div>

        <!-- Quick Vendor Command -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Vendor This Version</h2>
          <PCodeBlock :code="`# Add to your pbuf.yaml:
modules:
  - name: ${moduleName}
    tag: ${tag}
    out: third_party

# Then run:
# pbuf-cli vendor`" />
          <p class="text-zinc-400 text-sm mt-2">
            Learn more: 
            <a href="https://github.com/pbufio/pbuf-cli" target="_blank" rel="noopener noreferrer" class="text-brand hover:underline">
              pbuf-cli Documentation
            </a>
          </p>
        </div>

        <!-- Tabs -->
        <div class="mb-6 border-b border-surface-border">
          <div class="flex gap-6">
            <button
              @click="activeTab = 'files'"
              :class="[
                'pb-3 px-1 font-medium transition-colors',
                activeTab === 'files' 
                  ? 'text-brand border-b-2 border-brand' 
                  : 'text-zinc-400 hover:text-zinc-300'
              ]"
            >
              Proto Files ({{ protoFiles.length }})
            </button>
            <button
              @click="activeTab = 'dependencies'"
              :class="[
                'pb-3 px-1 font-medium transition-colors',
                activeTab === 'dependencies' 
                  ? 'text-brand border-b-2 border-brand' 
                  : 'text-zinc-400 hover:text-zinc-300'
              ]"
            >
              Dependencies ({{ dependencies.length }})
            </button>
            <button
              @click="activeTab = 'metadata'"
              :class="[
                'pb-3 px-1 font-medium transition-colors',
                activeTab === 'metadata' 
                  ? 'text-brand border-b-2 border-brand' 
                  : 'text-zinc-400 hover:text-zinc-300'
              ]"
            >
              Metadata
            </button>
          </div>
        </div>

        <!-- Proto Files Tab -->
        <div v-if="activeTab === 'files'" class="space-y-4">
          <div v-if="loadingProtoFiles" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            <p class="text-zinc-400 mt-4">Loading proto files...</p>
          </div>
          <div v-else-if="protoFilesError" class="text-center py-12">
            <PCard>
              <div class="mb-4">
                <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-zinc-300 font-semibold mb-2">Failed to Load Proto Files</p>
                <p class="text-zinc-400 text-sm">{{ protoFilesError }}</p>
              </div>
              <PButton variant="primary" @click="loadProtoFiles">
                Retry
              </PButton>
            </PCard>
          </div>
          <template v-else>
            <PCard v-for="file in protoFiles" :key="file.filename">
              <h3 class="text-lg font-semibold font-mono mb-3 text-zinc-100">{{ file.filename }}</h3>
              <div class="bg-surface-base rounded-lg p-4 overflow-x-auto">
                <pre class="font-mono text-sm text-zinc-300 whitespace-pre">{{ file.content }}</pre>
              </div>
            </PCard>
            <p v-if="protoFiles.length === 0 && !protoFilesError" class="text-zinc-400 text-center py-8">No proto files available.</p>
          </template>
        </div>

        <!-- Dependencies Tab -->
        <div v-if="activeTab === 'dependencies'" class="space-y-4">
          <PCard v-if="dependencies.length > 0">
            <div class="space-y-3">
              <div
                v-for="dep in dependencies"
                :key="`${dep.name}@${dep.tag}`"
                class="flex items-center justify-between p-4 bg-surface-base rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <span class="font-mono text-zinc-200">{{ dep.name }}</span>
                  <PBadge variant="brand">{{ dep.tag }}</PBadge>
                </div>
                <PButton variant="secondary" @click="$router.push(`/modules/${dep.name}`)">
                  View Module →
                </PButton>
              </div>
            </div>
          </PCard>
          <p v-else class="text-zinc-400 text-center py-8">No dependencies for this version.</p>
        </div>

        <!-- Metadata Tab -->
        <div v-if="activeTab === 'metadata'" class="space-y-4">
          <div v-if="metadata && metadata.packages">
            <PCard v-for="pkg in metadata.packages" :key="pkg.name" class="mb-4">
              <h3 class="text-xl font-bold mb-4 text-brand">Package: {{ pkg.name }}</h3>

              <!-- Proto Files in Package -->
              <div v-for="protoFile in pkg.protoFiles" :key="protoFile.filename" class="mb-6">
                <h4 class="text-lg font-semibold mb-3 font-mono text-zinc-200">{{ protoFile.filename }}</h4>

                <!-- Messages -->
                <div v-if="protoFile.messages && protoFile.messages.length > 0" class="mb-4">
                  <h5 class="text-md font-medium mb-2 text-zinc-300">Messages</h5>
                  <div class="space-y-3">
                    <div v-for="message in protoFile.messages" :key="message.name" class="bg-surface-base rounded-lg p-4">
                      <p class="font-mono text-brand mb-3">{{ message.name }}</p>
                      <div v-if="message.fields && message.fields.length > 0" class="pl-6 space-y-1.5">
                        <div v-for="field in message.fields" :key="field.name" class="text-sm font-mono">
                          <span class="text-zinc-500">{{ field.tag }}:</span>
                          <span class="text-zinc-300 ml-1">{{ field.messageType }}</span>
                          <span class="text-brand ml-1">{{ field.name }}</span>
                          <span v-if="field.repeated" class="text-zinc-500 ml-1">(repeated)</span>
                          <span v-if="field.optional" class="text-zinc-500 ml-1">(optional)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Services -->
                <div v-if="protoFile.services && protoFile.services.length > 0" class="mb-4">
                  <h5 class="text-md font-medium mb-2 text-zinc-300">Services</h5>
                  <div class="space-y-3">
                    <div v-for="service in protoFile.services" :key="service.name" class="bg-surface-base rounded-lg p-4">
                      <p class="font-mono text-brand mb-2">{{ service.name }}</p>
                      <div v-if="service.methods && service.methods.length > 0" class="ml-4 space-y-1">
                        <div v-for="method in service.methods" :key="method.name" class="text-sm font-mono text-zinc-400">
                          <span class="text-zinc-300">{{ method.name }}</span>
                          <span class="text-zinc-500">({{ method.inputType }}) → {{ method.outputType }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PCard>
          </div>
          <p v-else class="text-zinc-400 text-center py-8">No metadata available.</p>
        </div>
      </div>
    </div>
  </div>
</template>
