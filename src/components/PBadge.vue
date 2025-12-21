<script setup>
defineProps({
  variant: { type: String, default: 'default' }
});
</script>

<template>
  <span :class="[
    'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium',
    variant === 'brand' 
      ? 'bg-brand/10 text-brand border border-brand/20'
      : variant === 'draft'
      ? 'bg-zinc-700/50 text-zinc-400 border border-zinc-700'
      : 'bg-surface-card text-zinc-300 border border-surface-border'
  ]">
    <slot />
  </span>
</template>
