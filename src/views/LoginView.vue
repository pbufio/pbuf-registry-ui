<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PCard from '@/components/PCard.vue'
import PInput from '@/components/PInput.vue'
import PButton from '@/components/PButton.vue'
import { appConfig } from '@/config/appConfig'
import { authToken, normalizeToken, validateTokenFormat } from '@/auth/authToken'
import { registryApi } from '@/services/registryApi'
import { getLoginValidationErrorMessage } from '@/utils/loginValidationUtils'

const router = useRouter()
const route = useRoute()

const token = ref('')
const error = ref('')
const submitting = ref(false)

const nextUrl = computed(() => {
  const next = route.query.next
  if (!next) return '/modules'
  if (Array.isArray(next)) return next[0] || '/modules'
  return String(next)
})

const submit = async () => {
  error.value = ''

  // Normalize and validate token format before making API call
  const normalized = normalizeToken(token.value)
  const validation = validateTokenFormat(normalized)
  if (!validation.valid) {
    error.value = validation.error
    return
  }

  if (submitting.value) return
  submitting.value = true

  // Set token so the validation request includes Authorization header.
  authToken.setToken(normalized)

  try {
    // Validate token + read access using a simple read-only call.
    await registryApi.listModules(1)
    await router.replace(nextUrl.value)
  } catch (e) {
    authToken.clearToken()
    error.value = getLoginValidationErrorMessage(e)
  } finally {
    submitting.value = false
  }
}

</script>

<template>
  <div class="min-h-screen bg-surface-base">
    <div class="max-w-xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold tracking-tight mb-6">Login</h1>

      <PCard>
        <div class="space-y-4">
          <PInput
            v-model="token"
            placeholder="pbuf_user_... (or pbuf_bot_...)"
            type="password"
            @keyup.enter="submit"
          />

          <div v-if="error" class="text-red-400 text-sm">{{ error }}</div>

          <div class="flex items-center gap-3">
            <PButton @click="submit" :disabled="submitting">
              {{ submitting ? 'Checking…' : 'Login' }}
            </PButton>
            <PButton v-if="appConfig.publicEnabled" variant="secondary" to="/modules">Continue without login</PButton>
          </div>
        </div>
      </PCard>
    </div>
  </div>
</template>
