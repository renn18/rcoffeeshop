"use client";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NavbarDemo() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        setIsOpen(false);
        router.push("/");
    };

    const handleLogin = () => {
        setIsOpen(false);
        router.push("/login");
    }

    const handleDashboard = () => {
        setIsOpen(false);
        router.push("/admin");
    }

    const navItems = [
        {
            name: "Menu",
            link: "/menu",
        },
        {
            name: "Tentang Kami",
            link: "/aboutus",
        },
        {
            name: "Kontak",
            link: "/contact",
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative w-full">
            <Navbar>
                {/* Desktop Navigation */}
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} />
                    <div className="flex items-center gap-4">
                        {
                            user ? (
                                <>
                                    <NavbarButton variant="secondary" onClick={handleDashboard}>Dashboard</NavbarButton>
                                    <NavbarButton variant="primary" onClick={handleLogout}>Logout</NavbarButton>
                                </>
                            ) : (
                                <NavbarButton
                                    onClick={handleLogin}
                                    variant="secondary"
                                >
                                    Login
                                </NavbarButton>
                            )
                        }
                    </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {navItems.map((item, idx) => (
                            <a
                                key={`mobile-link-${idx}`}
                                href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-neutral-600 dark:text-neutral-300"
                            >
                                <span className="block">{item.name}</span>
                            </a>
                        ))}
                        <div className="flex w-full flex-col gap-4">
                            {user ? (
                                <>
                                    <NavbarButton
                                        onClick={handleDashboard}
                                        variant="primary"
                                        className="w-full"
                                    >
                                        Dashboard
                                    </NavbarButton>
                                    <NavbarButton
                                        onClick={handleLogout}
                                        variant="primary"
                                        className="w-full"
                                    >
                                        Logout
                                    </NavbarButton>
                                </>
                            ) : (
                                <NavbarButton
                                    onClick={handleLogin}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    Login
                                </NavbarButton>
                            )}
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}
