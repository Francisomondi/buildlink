import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2, Paperclip } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { directMessagesService } from "@/services/directMessagesService"
import { useMessagingStore } from "@/stores/messagingStore"
import { useToast } from "@/hooks/use-toast"

interface RecipientInputProps {
  onStartChat: (user: UserListItem) => void
}

interface UserListItem {
  id: string
  name?: string
  avatar?: string
}

export default function RecipientInput({ onStartChat }: RecipientInputProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const currentUserId = user?.id

  const addMessageToStore = useMessagingStore((s) => s.addMessage)

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<UserListItem[]>([])
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null)
  const [message, setMessage] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ✅ Close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ✅ Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!query.trim()) {
        setResults([])
        return
      }
      fetchUsers(query)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  const fetchUsers = async (search: string) => {
    if (!currentUserId) return

    setLoading(true)

    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, avatar")
      .ilike("full_name", `%${search}%`)
      .neq("id", currentUserId)
      .limit(10)

    if (data) {
      setResults(
        data.map((u) => ({
          id: u.id,
          name: u.full_name,
          avatar: u.avatar,
        }))
      )
      setOpen(true)
    }

    setLoading(false)
  }

  const handleSelectUser = (user: UserListItem) => {
    setSelectedUser(user)
    setQuery(user.name || "")
    setOpen(false)
  }

  // ✅ Upload file to Supabase
  const uploadFile = async (file: File) => {
    const ext = file.name.split(".").pop()
    const fileName = `${Date.now()}.${ext}`
    const filePath = `chat/${fileName}`

    const { error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file)

    if (error) throw error

    const { data } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  // ✅ SEND MESSAGE + FILE
  const handleStart = async () => {
    if (!selectedUser || !currentUserId) return

    setCreating(true)

    try {
      let image_url: string | undefined
      let image_type: "image" | "pdf" | null = null

      // Upload file if exists
      if (file) {
        image_url = await uploadFile(file)
        image_type = file.type.startsWith("image") ? "image" : "pdf"
      }

      // Send if message or file exists
      if (message.trim() || image_url) {
        const { data, error } = await directMessagesService.sendMessage({
          sender_id: currentUserId,
          recipient_id: selectedUser.id,
          content: message.trim(),
          image_url,
          image_type,
        })

        if (error) throw error

        if (data) {
          addMessageToStore(data)
        }
      }

      // Open chat
      await onStartChat(selectedUser)

      // Reset
      setMessage("")
      setQuery("")
      setSelectedUser(null)
      setFile(null)

    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      })
    }

    setCreating(false)
  }

  return (
    <div ref={wrapperRef} className="flex flex-col gap-4 p-4">

      {/* TITLE */}
      <h2 className="text-center text-lg font-semibold">
        Create New Message
      </h2>

      {/* RECIPIENT */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Recipient</label>

        <div className="relative">
          <Input
            placeholder="Search user..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedUser(null)
            }}
            onFocus={() => query && setOpen(true)}
          />

          {open && (
            <div className="absolute left-0 right-0 z-50 mt-1 max-h-52 overflow-y-auto rounded-md border bg-white shadow-md">
              
              {loading && (
                <div className="flex justify-center p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="p-3 text-sm text-muted-foreground">
                  No users found
                </div>
              )}

              {!loading &&
                results.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="flex w-full items-center gap-3 p-3 hover:bg-muted text-left"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatar ?? ""} />
                      <AvatarFallback>
                        {user.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <span className="text-sm">{user.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* MESSAGE */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Message</label>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] w-full resize-none rounded-md border p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your message..."
        />
      </div>

      {/* FILE PREVIEW */}
      {file && (
        <div className="text-xs text-muted-foreground">
          Attached: {file.name}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center justify-between pt-2">

        {/* FILE INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => {
            const selected = e.target.files?.[0]
            if (!selected) return

            if (
              !selected.type.startsWith("image") &&
              selected.type !== "application/pdf"
            ) {
              toast({
                title: "Invalid file",
                description: "Only images and PDFs allowed",
                variant: "destructive",
              })
              return
            }

            setFile(selected)
          }}
        />

        {/* ATTACH BUTTON */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setQuery("")
              setSelectedUser(null)
              setMessage("")
              setFile(null)
            }}
          >
            Cancel
          </Button>

          <Button
            disabled={!selectedUser || creating}
            onClick={handleStart}
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}