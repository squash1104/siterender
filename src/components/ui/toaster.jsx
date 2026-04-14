import { useToast } from "@/components/ui/use-toast"
import { Toast } from "@/components/ui/toast"

export const Toaster = () => {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          onClick={() => dismiss(toast.id)}
        >
          {toast.title && <div className="font-medium">{toast.title}</div>}
          {toast.description && <div className="text-sm text-muted-foreground">{toast.description}</div>}
        </Toast>
      ))}
    </div>
  )
}