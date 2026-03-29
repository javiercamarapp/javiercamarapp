'use client'

import { useToast } from '@/components/ui/use-toast'

export function useToastNotifications() {
  const { toast } = useToast()

  return {
    success: (title: string, description?: string) => {
      toast({
        title,
        description,
        duration: 3000,
      })
    },
    error: (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: 'destructive',
        duration: 5000,
      })
    },
    warning: (title: string, description?: string) => {
      toast({
        title,
        description,
        duration: 4000,
      })
    },
    info: (title: string, description?: string) => {
      toast({
        title,
        description,
        duration: 3000,
      })
    },
  }
}
