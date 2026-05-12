import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Building2, Calendar, Users, MessageCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { profileService } from "@/services/profileService"
import { connectionsService } from "@/services/connectionsService"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface UserProfileProps {
	userId?: string
	onClose: () => void
}

type ConnectionStatus =
	| "not_connected"
	| "pending_outgoing"
	| "pending_incoming"
	| "connected"
	| "self"

const UserProfile = ({ userId, onClose }: UserProfileProps) => {
	const { user } = useAuth()
	const { toast } = useToast()

	const [profile, setProfile] = useState<any>(null)
	const [loading, setLoading] = useState(true)

	const [connectionStatus, setConnectionStatus] =
		useState<ConnectionStatus>("not_connected")

	const [connectionRow, setConnectionRow] = useState<any | null>(null)

	// Company detection
	const isCompany = profile?.user_type === "company"

	useEffect(() => {
		loadProfile()
	}, [userId, user?.id])

	const loadProfile = async () => {
		if (!userId && !user) return

		try {
			setLoading(true)

			const targetId = userId || user?.id

			if (!targetId) return

			const { data, error } =
				await profileService.getProfile(targetId)

			if (error) throw error

			setProfile(data)

			// No logged in user
			if (!user?.id) {
				setConnectionRow(null)
				setConnectionStatus("not_connected")
				return
			}

			// Own profile
			if (user.id === targetId) {
				setConnectionRow(null)
				setConnectionStatus("self")
				return
			}

			// Existing connection
			const { data: connData } =
				await connectionsService.getConnectionStatus(
					user.id,
					targetId
				)

			if (!connData) {
				setConnectionRow(null)
				setConnectionStatus("not_connected")
				return
			}

			setConnectionRow(connData)

			if (connData.status === "accepted") {
				setConnectionStatus("connected")
			} else if (connData.status === "pending") {
				if (connData.user_id === user.id) {
					setConnectionStatus("pending_outgoing")
				} else {
					setConnectionStatus("pending_incoming")
				}
			}
		} catch (error) {
			console.error("Error loading profile:", error)
		} finally {
			setLoading(false)
		}
	}

	// FOLLOW / CONNECT
	const handleConnect = async () => {
	if (!user?.id || !profile?.id) return

	// =========================
	// COMPANY FOLLOW / UNFOLLOW
	// =========================
	if (isCompany) {

		// UNFOLLOW
		if (
			connectionStatus === "connected" &&
			connectionRow?.id
		) {
			const { error } =
				await connectionsService.removeConnection(
					connectionRow.id
				)

			if (!error) {
				setConnectionRow(null)
				setConnectionStatus("not_connected")

				toast({
					title: `You're no longer following ${profile.full_name}`,
				})
			}

			return
		}

		// INSTANT FOLLOW
		const { data, error } =
			await connectionsService.connect(
				user.id,
				profile.id,
				true // THIS is the important fix
			)

		if (error) {
			console.error(error)
			return
		}

		if (data) {
			setConnectionRow(data)

			// instantly connected/following
			setConnectionStatus("connected")

			toast({
				title: `You're now following ${profile.full_name}`,
			})
		}

		return
	}

	// =========================
	// NORMAL USER CONNECTION
	// =========================
	const { data, error } =
		await connectionsService.connect(
			user.id,
			profile.id
		)

	if (error) {
		console.error(error)
		return
	}

	if (data) {
		setConnectionRow(data)

		// NORMAL USERS STILL REQUIRE REQUEST
		setConnectionStatus("pending_outgoing")
	}
}

	// ACCEPT REQUEST
	const handleAccept = async () => {
		if (!connectionRow?.id) return

		try {
			const { data, error } =
				await connectionsService.acceptRequest(
					connectionRow.id
				)

			if (error) throw error

			if (data) {
				setConnectionRow(data)
				setConnectionStatus("connected")

				toast({
					title: "Connection accepted",
				})
			}
		} catch (error) {
			console.error("Accept request error:", error)

			toast({
				title: "Failed to accept request",
				variant: "destructive",
			})
		}
	}

	// BUTTON LOGIC
	const renderConnectButton = () => {
		if (connectionStatus === "self") return null

		// CONNECTED
		if (connectionStatus === "connected") {
			return (
				<Button
				onClick={isCompany ? handleConnect : undefined}
				disabled={!isCompany}
				className="flex-1"
				variant={isCompany ? "secondary" : "default"}
			>
					<Users className="mr-1 h-4 w-4" />

					{isCompany ? "Following" : "Connected"}
				</Button>
			)
		}

		// PENDING OUTGOING
		if (connectionStatus === "pending_outgoing") {
			return (
				<Button disabled className="flex-1">
					{isCompany ? "Following" : "Pending"}
				</Button>
			)
		}

		// PENDING INCOMING
		if (connectionStatus === "pending_incoming") {
			return (
				<Button
					onClick={handleAccept}
					className="flex-1"
				>
					{isCompany ? "Follow Back" : "Accept"}
				</Button>
			)
		}

		// NOT CONNECTED
		return (
			<Button
				onClick={handleConnect}
				className="flex-1"
			>
				<Users className="mr-1 h-4 w-4" />

				{isCompany ? "Follow" : "Connect"}
			</Button>
		)
	}

	// LOADING
	if (loading) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
				<Card className="w-full max-w-md">
					<CardContent className="p-6 text-center">
						<div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>

						<p className="mt-2 text-gray-600">
							Loading profile...
						</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	// PROFILE NOT FOUND
	if (!profile) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
				<Card className="w-full max-w-md">
					<CardContent className="p-6 text-center">
						<p className="text-gray-600">
							Profile not found
						</p>

						<Button
							onClick={onClose}
							className="mt-4"
						>
							Close
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<Card className="max-h-[80vh] w-full max-w-md overflow-y-auto">
				<CardContent className="p-6">

					{/* HEADER */}
					<div className="mb-4 flex items-start justify-between">
						<div className="flex items-center space-x-4">

							<Avatar className="h-16 w-16">
								<AvatarImage src={profile.avatar} />

								<AvatarFallback>
									{profile.full_name
										?.split(" ")
										.map((n: string) => n[0])
										.join("") || "U"}
								</AvatarFallback>
							</Avatar>

							<div>
								<h2 className="text-xl font-bold text-gray-900">
									{profile.full_name || "User"}
								</h2>

								<p className="text-gray-600">
									{profile.profession ||
										"Professional"}
								</p>

								<p className="text-sm text-gray-500">
									{profile.organization ||
										"Organization"}
								</p>
							</div>
						</div>

						<Button
							variant="ghost"
							size="sm"
							onClick={onClose}
						>
							×
						</Button>
					</div>

					{/* DETAILS */}
					<div className="mb-6 space-y-3">

						<div className="flex items-center text-sm text-gray-600">
							<Building2 className="mr-2 h-4 w-4" />

							{profile.title ||
								"No title specified"}
						</div>

						{profile.education_level && (
							<div className="flex items-center text-sm text-gray-600">
								<Calendar className="mr-2 h-4 w-4" />

								{profile.education_level}
							</div>
						)}
					</div>

					{/* ACTIONS */}
					<div className="flex space-x-2">

						{renderConnectButton()}

						<Button
							variant="outline"
							className="flex-1"
						>
							<MessageCircle className="mr-1 h-4 w-4" />

							Message
						</Button>
					</div>

				</CardContent>
			</Card>
		</div>
	)
}

export default UserProfile