<script setup>
import PButton from '@/components/PButton.vue'
import PCodeBlock from '@/components/PCodeBlock.vue'
import PFeatureCard from '@/components/PFeatureCard.vue'
</script>

<template>
  <div class="min-h-screen bg-surface-base">
    <!-- Hero Section -->
    <header class="max-w-4xl mx-auto text-center py-20 px-4">
      <div class="mb-6">
        <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Modern <span class="text-brand">Protobuf</span> Registry
        </h1>
        <p class="text-xl md:text-2xl text-zinc-400 mb-8 max-w-2xl mx-auto">
          Simplify your Protocol Buffers file management with pbuf.io
        </p>
      </div>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
        <PButton to="/modules">Browse Modules</PButton>
        <PButton variant="secondary" href="https://github.com/pbufio/pbuf-cli" external>View Docs</PButton>
      </div>

      <div class="max-w-2xl mx-auto">
        <PCodeBlock code="pbuf-cli init my-service" />
      </div>
    </header>

    <!-- Features Section -->
    <section class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PFeatureCard>
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
          <template #title>Free Forever</template>
          Open-source registry with no hidden costs for the community.
        </PFeatureCard>

        <PFeatureCard>
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </template>
          <template #title>Cloud Registry</template>
          Securely push and version your proto files in the cloud.
        </PFeatureCard>

        <PFeatureCard>
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </template>
          <template #title>CLI Tools</template>
          Powerful CLI for vendoring and managing dependencies.
        </PFeatureCard>
      </div>
    </section>

    <!-- Getting Started Section -->
    <section class="max-w-4xl mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold text-center mb-8 tracking-tight">Getting Started</h2>
      
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-3 text-zinc-200">1. Install the CLI</h3>
          <PCodeBlock code="go install github.com/pbufio/pbuf-cli@latest" />
          <p class="text-zinc-400 text-sm mt-2">
            Or download binaries from 
            <a href="https://github.com/pbufio/pbuf-cli/releases" target="_blank" rel="noopener noreferrer" class="text-brand hover:underline">
              GitHub Releases
            </a>
          </p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-zinc-200">2. Initialize Your Project</h3>
          <PCodeBlock code="pbuf-cli init my-service" />
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3 text-zinc-200">3. Push Your Protos</h3>
          <PCodeBlock code="pbuf-cli modules push v1.0.0" />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-4xl mx-auto px-4 py-20 text-center">
      <h2 class="text-3xl font-bold mb-4 tracking-tight">Ready to get started?</h2>
      <p class="text-zinc-400 mb-8 text-lg">Join developers worldwide using pbuf.io for their protobuf registry needs.</p>
      <PButton to="/modules">Explore Modules</PButton>
    </section>
  </div>
</template>
