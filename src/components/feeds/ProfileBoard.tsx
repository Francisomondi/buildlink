import { BookOpen, Users, Edit, BriefcaseBusiness } from "lucide-react"

import ProfileHeader from "./ProfileHeader"

import PortfolioSection from "../profile-sections/details/PortfolioSection"
import ProfileEducation from "../profile-sections/details/EducationSection"
import ProfileExperience from "../profile-sections/details/ExperienceSection"
import ProfileSkillsSection from "../profile-sections/details/ProfileSkillsSection"
import ProfileCertifications from "../profile-sections/details/CertificationsSection"
import LanguagesSection from "../profile-sections/details/LanguagesSection"
import AboutActivitySection from "../profile-sections/details/AboutActivitySection"

import { useProfile } from "@/hooks/useProfile"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ProfileCompletionIndicator from "@/components/profile/ProfileCompletionIndicator"

import { UserProfile } from "@/types"


/* =========================================================
   CONNECTIONS PREVIEW
========================================================= */

const ConnectionsPreview = ({
	profile,
}: {
	profile: UserProfile
}) => {
	// TODO:
	// Replace this with connectionsService when available.
	const connections: any[] = []

	return (
		<Card className="border border-border shadow-sm">
			<CardContent className="p-5">

				<div className="mb-4 flex items-center justify-between">

					<div>
						<h3 className="text-lg font-semibold">
							Connections
						</h3>

						<p className="text-sm text-muted-foreground">
							People in your professional network
						</p>
					</div>

					<Button
						variant="outline"
						size="sm"
						disabled={connections.length === 0}
					>
						View All
					</Button>

				</div>

				{connections.length > 0 ? (

					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

						{connections
							.slice(0, 8)
							.map((connection) => (

								<div
									key={connection.id}
									className="rounded-lg border p-3 text-center"
								>
									{/* Connection avatar */}
									<div className="mx-auto mb-2 h-12 w-12 rounded-full bg-muted" />

									<p className="truncate text-sm font-medium">
										{connection.name}
									</p>

								</div>
							))}

					</div>

				) : (

					<div className="rounded-lg border border-dashed p-8 text-center">

						<Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

						<p className="font-medium">
							No connections yet
						</p>

						<p className="mt-1 text-sm text-muted-foreground">
							Start connecting with professionals in your industry.
						</p>

						<Button
							variant="outline"
							size="sm"
							className="mt-4"
						>
							Find People
						</Button>

					</div>
				)}

			</CardContent>
		</Card>
	)
}


/* =========================================================
   STAT CARD
========================================================= */

interface StatCardProps {
	title: string
	value: number | string
	icon: React.ElementType
	iconClassName?: string
}

const StatCard = ({
	title,
	value,
	icon: Icon,
	iconClassName = "text-primary",
}: StatCardProps) => {
	return (
		<Card className="border border-border shadow-sm">

			<CardContent className="p-5">

				<div className="flex items-center justify-between gap-4">

					<div className="min-w-0">

						<p className="truncate text-sm text-muted-foreground">
							{title}
						</p>

						<p className="mt-1 text-3xl font-bold text-foreground">
							{value}
						</p>

					</div>

					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">

						<Icon
							className={`h-6 w-6 ${iconClassName}`}
						/>

					</div>

				</div>

			</CardContent>

		</Card>
	)
}


/* =========================================================
   PROFESSIONAL PROFILE SECTIONS
========================================================= */

const ProfessionalSections = ({
	profile,
	handleProfileUpdate,
}: {
	profile: UserProfile
	handleProfileUpdate: (...args: any[]) => any
}) => {
	return (
		<div className="space-y-6">

			<PortfolioSection
				canEdit={true}
				profile={profile}
				handleProfileUpdate={handleProfileUpdate}
			/>

			<ProfileExperience
				canEdit={true}
				profile={profile}
				handleProfileUpdate={handleProfileUpdate}
			/>

			<ProfileEducation
				canEdit={true}
				profile={profile}
				handleProfileUpdate={handleProfileUpdate}
			/>

			<ProfileCertifications
				canEdit={true}
				profile={profile}
				handleProfileUpdate={handleProfileUpdate}
			/>

			<LanguagesSection
				profile={profile}
				handleProfileUpdate={handleProfileUpdate}
			/>

		</div>
	)
}


/* =========================================================
   COMPANY FEATURED SECTION
========================================================= */

const CompanyFeatured = () => {
	return (
		<Card className="border border-border shadow-sm">

			<CardContent className="p-5 md:p-6">

				<div className="mb-6 flex items-center justify-between gap-4">

					<div>
						<h3 className="text-lg font-semibold">
							Featured
						</h3>

						<p className="text-sm text-muted-foreground">
							Showcase your company's best work.
						</p>
					</div>

					<div className="flex items-center gap-2">

						<Button
							variant="outline"
							size="sm"
							className="hidden sm:flex"
						>
							+ Add Item
						</Button>

						<Button
							variant="ghost"
							size="icon"
						>
							<Edit className="h-4 w-4" />
						</Button>

					</div>

				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

					{[1, 2, 3].map((item) => (

						<div
							key={item}
							className="group overflow-hidden rounded-xl border bg-muted/20 transition hover:shadow-md"
						>

							<div className="flex h-32 items-center justify-center bg-primary/10">

								<BriefcaseBusiness className="h-10 w-10 text-primary/60" />

							</div>

							<div className="p-4">

								<p className="font-semibold">
									Featured Item {item}
								</p>

								<p className="mt-1 text-sm text-muted-foreground">
									Add a project, service or company achievement.
								</p>

							</div>

						</div>

					))}

				</div>

			</CardContent>

		</Card>
	)
}


/* =========================================================
   COMPANY PRODUCTS
========================================================= */

const CompanyProducts = () => {
	return (
		<Card className="border border-border shadow-sm">

			<CardContent className="relative p-5 md:p-6">

				<Button
					variant="ghost"
					size="icon"
					className="absolute right-4 top-4"
				>
					<Edit className="h-4 w-4" />
				</Button>

				<div className="pr-10">

					<h3 className="text-lg font-semibold">
						Products & Services
					</h3>

					<p className="mt-1 text-sm text-muted-foreground">
						Show visitors what your company offers.
					</p>

				</div>

				<div className="mt-6 rounded-xl border border-dashed p-6 text-center">

					<BriefcaseBusiness className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

					<p className="font-medium">
						No products or services added
					</p>

					<p className="mt-1 text-sm text-muted-foreground">
						Add your products and services to attract potential clients.
					</p>

					<Button
						variant="outline"
						size="sm"
						className="mt-4"
					>
						+ Add Product
					</Button>

				</div>

			</CardContent>

		</Card>
	)
}


/* =========================================================
   PROFILE BOARD
========================================================= */

const ProfileBoard = () => {

	const {
		profile,
		userPosts,
		loading,
		uploading,
		handleProfileUpdate,
		handleAvatarChange,
		handleAvatarRemove,
	} = useProfile()


	/* =======================================================
	   LOADING
	======================================================= */

	if (loading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">

				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />

			</div>
		)
	}


	/* =======================================================
	   PROFILE NOT FOUND
	======================================================= */

	if (!profile) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">

				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">

					<Users className="h-8 w-8 text-muted-foreground" />

				</div>

				<h3 className="text-lg font-semibold">
					Profile not found
				</h3>

				<p className="mt-1 text-sm text-muted-foreground">
					Unable to load your profile data.
				</p>

			</div>
		)
	}


	const userType =
		profile.user_type?.toLowerCase() || "student"


	const isCompany =
		userType === "company"


	const portfolioCount =
		profile.portfolio?.length || 0


	return (
		<div className="mx-auto w-full max-w-5xl space-y-6 px-3 py-4 sm:px-4 md:px-0 md:py-6">


			{/* =================================================
			    PROFILE HEADER
			================================================= */}

			<ProfileHeader
				profile={profile}
				uploading={uploading}
				handleAvatarChange={handleAvatarChange}
				handleAvatarRemove={handleAvatarRemove}
				handleProfileUpdate={handleProfileUpdate}
			/>


			{/* =================================================
			    PROFILE STATISTICS
			================================================= */}

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

				<StatCard
					title={isCompany ? "Staff" : "Portfolio Items"}
					value={isCompany ? 0 : portfolioCount}
					icon={BookOpen}
					iconClassName="text-green-600"
				/>

				<StatCard
					title={isCompany ? "Following" : "Connections"}
					value={0}
					icon={Users}
					iconClassName="text-purple-600"
				/>

				<Card className="border border-border shadow-sm sm:col-span-2">

					<CardContent className="p-4">

						<ProfileCompletionIndicator
							score={
								profile.profile_completion_score || 0
							}
							showDetails
						/>

					</CardContent>

				</Card>

			</div>


			{/* =================================================
			    ABOUT + ACTIVITY
			================================================= */}

			<AboutActivitySection
				profile={profile}
				publicProfile={false}
				userPosts={userPosts}
				handleProfileUpdate={handleProfileUpdate}
			/>


			{/* =================================================
			    SKILLS
			================================================= */}

			<ProfileSkillsSection
				profile={profile}
				canEdit={true}
				handleProfileUpdate={handleProfileUpdate}
			/>


			{/* =================================================
			    STUDENT / PROFESSIONAL
			================================================= */}

			{!isCompany && (
				<ProfessionalSections
					profile={profile}
					handleProfileUpdate={handleProfileUpdate}
				/>
			)}


			{/* =================================================
			    COMPANY
			================================================= */}

			{isCompany && (
				<div className="space-y-6">

					<CompanyFeatured />

					<CompanyProducts />

				</div>
			)}


			{/* =================================================
			    CONNECTIONS
			================================================= */}

			<ConnectionsPreview
				profile={profile}
			/>

		</div>
	)
}


export default ProfileBoard