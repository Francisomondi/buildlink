import {
	Search,
	BarChart3,
	Settings,
	Sun,
	Moon,
	Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import UserProfileButton from "@/components/UserProfileButton"
import SearchDialog from "@/components/SearchDialog"
import EnhancedNotificationsDropdown from "@/components/EnhancedNotificationsDropdown"
import SearchDropdown from "./SearchDropdown"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { cn } from "@/lib/utils"
import logo from "@/assets/buildlink-logo.png?w=240&quality=90&format=webp"
import { useTheme } from "@/contexts/ThemeContext"

interface TopBarProps {
	onLogoClick: () => void
	onMenuClick?: () => void
	loading?: boolean
}

const TopBar = ({
	onLogoClick,
	onMenuClick,
	loading = false,
}: TopBarProps) => {
	const { isAdmin } = useIsAdmin()
	const location = useLocation()
	const { theme, toggleTheme } = useTheme()

	const isAdminAnalytics =
		location.pathname === "/admin-analytics"

	const isAdminResources =
		location.pathname === "/admin-resources"

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-4 md:px-8">

				{/* =====================================
				    LEFT SIDE
				===================================== */}
				<div className="flex items-center gap-2">

					{/* Mobile Menu */}
					{onMenuClick && (
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={onMenuClick}
							aria-label="Open menu"
						>
							<Menu className="h-5 w-5" />
						</Button>
					)}

					{/* Logo */}
					<button
						type="button"
						onClick={onLogoClick}
						className="flex items-center rounded-md px-1 py-1 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary"
						aria-label="Go to BuildLink home"
					>
						<img
							src={logo}
							alt="BuildLink"
							className="mr-2 h-7 w-7 object-contain"
						/>

						<span className="text-base font-semibold sm:text-lg">
							BuildLink
						</span>
					</button>

					{/* Loading indicator */}
					{loading && (
						<div
							className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary"
							aria-label="Loading"
						/>
					)}
				</div>

				{/* =====================================
				    CENTER SEARCH
				===================================== */}
				<div className="mx-3 hidden max-w-xl flex-1 sm:flex">
					<SearchDropdown />
				</div>

				{/* =====================================
				    RIGHT SIDE
				===================================== */}
				<div className="flex items-center gap-1 sm:gap-2">

					{/* Mobile Search */}
					<SearchDialog>
						<Button
							variant="ghost"
							size="icon"
							className="sm:hidden"
							aria-label="Search"
						>
							<Search className="h-5 w-5" />
						</Button>
					</SearchDialog>

					{/* Theme Toggle */}
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleTheme}
						title={
							theme === "dark"
								? "Switch to light mode"
								: "Switch to dark mode"
						}
						aria-label={
							theme === "dark"
								? "Switch to light mode"
								: "Switch to dark mode"
						}
					>
						{theme === "dark" ? (
							<Sun className="h-5 w-5" />
						) : (
							<Moon className="h-5 w-5" />
						)}
					</Button>

					{/* =====================================
					    ADMIN ACTIONS
					===================================== */}
					{isAdmin && (
						<div className="hidden items-center gap-1 md:flex">

							<Link to="/admin-analytics">
								<Button
									variant="ghost"
									size="icon"
									title="Analytics"
									aria-label="Analytics"
									className={cn(
										isAdminAnalytics &&
											"bg-accent text-accent-foreground"
									)}
								>
									<BarChart3 className="h-5 w-5" />
								</Button>
							</Link>

							<Link to="/admin-resources">
								<Button
									variant="ghost"
									size="icon"
									title="Admin Resources"
									aria-label="Admin Resources"
									className={cn(
										isAdminResources &&
											"bg-accent text-accent-foreground"
									)}
								>
									<Settings className="h-5 w-5" />
								</Button>
							</Link>

						</div>
					)}

					{/* Notifications */}
					<EnhancedNotificationsDropdown />

					{/* User Profile */}
					<UserProfileButton />
				</div>
			</div>
		</header>
	)
}

export default TopBar