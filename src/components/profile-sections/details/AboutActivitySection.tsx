import ProfileAbout from "@/components/feeds/ProfileAbout"
import ProfileActivity from "@/components/feeds/ProfileActivity"
import { Card, CardContent } from "@/components/ui/card"
import { UserProfile } from "@/types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"

const AboutActivitySection = ({ profile, userPosts, handleProfileUpdate, publicProfile }: { profile: UserProfile; userPosts: any[]; handleProfileUpdate?: () => void; publicProfile?: boolean }) => {
	const userType = profile?.user_type?.toLowerCase() || "student"

	// Get account-type-specific colors matching ProfileHeader
	const getColorConfig = () => {
		if (userType === "student") {
			return {
				bgColor: "bg-student-100 dark:bg-yellow-950",
				borderColor: "border-student-border",
				activeTabClass: "data-[state=active]:bg-student-100 dark:data-[state=active]:bg-yellow-950",
			}
		} else if (userType === "professional") {
			return {
				bgColor: "bg-professional-100 dark:bg-orange-950",
				borderColor: "border-professional-border",
				activeTabClass: "data-[state=active]:bg-professional-100 dark:data-[state=active]:bg-orange-950",
			}
		} else if (userType === "company") {
			return {
				bgColor: "bg-company-100 dark:bg-green-950",
				borderColor: "border-company-border",
				activeTabClass: "data-[state=active]:bg-company-100 dark:data-[state=active]:bg-green-950",
			}
		}
		// Default fallback
		return {
			bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
			borderColor: "border-blue-200",
			activeTabClass: "data-[state=active]:bg-blue-50",
		}
	}

	const colorConfig = getColorConfig()

	return (
		<Card className={`border border-border ${colorConfig.bgColor} shadow-sm`}>
			<CardContent className="p-0">
				<Tabs
				defaultValue="about"
				className="w-full rounded-lg">
				<div className="border-b border-border">
					<TabsList className="flex h-auto w-full border-0 bg-transparent p-0">
					<TabsTrigger
						value="about"
						className={`flex-1 rounded-tl-lg bg-muted px-6 py-3 text-muted-foreground ${colorConfig.activeTabClass} data-[state=active]:text-foreground`}>
						About
					</TabsTrigger>
					<TabsTrigger
						value="activity"
						className={`flex-1 rounded-tr-lg bg-muted px-6 py-3 text-muted-foreground ${colorConfig.activeTabClass} data-[state=active]:text-foreground`}>
						Activity
					</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="about" className="mt-0 p-4">
					<ProfileAbout
					profile={profile}
					publicProfile={publicProfile}
					handleProfileUpdate={handleProfileUpdate}
					/>
				</TabsContent>
				<TabsContent value="activity" className="mt-0 p-4">
					<ProfileActivity
					userPosts={userPosts}
					noCard={true}
					/>
				</TabsContent>
			</Tabs>
			</CardContent>
		</Card>
	)
}

export default AboutActivitySection
