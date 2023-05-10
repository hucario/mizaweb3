/**
 * 
 * This file is where the links in the navbar are defined.
 * 
 * Please don't monkeypatch navbar manually, I already added rainbow support so
 * just make it a CSS linear-gradient().
 * 
 */

import { DONATION_LINK, SUPPORT_SERVER_LINK } from "@/lib/constants";
import { ThemeVars } from "@/lib/theme";
import { StaticImageData } from "next/image";

/**
 * Icons! Import the ones you need. Don't import them all. That'll balloon the bundle size.
 */

import {
    Icon,
    Compass,
    LifeBuoy,
    MessageSquare,
    Terminal,
    DollarSign,
    PieChart,
    File,
    BarChart2,
    DownloadCloud
} from 'react-feather'


export type NavigationContent = {
    /**
     * Either an image URL, or local image data.
     * 
     * If it's a local image, please import it using this template:
     * ```ts
     *  import coolImage from './images/cool_image.[jpg|png|webp]';
     * ```
     * and then use it like so:
     * ```ts
     * const coolEntry = {
     *  img: coolImage
     * }
     * ```
     * This is static. The import is processed at build time, so unfortunately it doesn't work
     * to import something that doesn't exist yet.
     */
	img?: string | StaticImageData;

    /**
     * Passed straight to CSS. The fill color of the icon.
     * Try to make sure that your color works with both light and dark mode!
     * If you don't want to worry about that, you can just use a theme var.
     * ```ts
     * const coolEntry = {
     *  iconColor: 'linear-gradient(45deg, red, orange, yellow, green, blue, purple)'
     * }
     * ```
     */
	iconColor: string;


    /**
     * @link { https://feathericons.com }
     * 
     * ```ts
     * const coolEntry = {
     *  icon: FeatherIcon
     * }
     * ```
     */
	icon: Icon;

	title: string;
	subtitle: string;

    /**
     * Where it links to
     */
    href: string;
    /**
     * Does it link to another mizabot.xyz page?
     */
    isInternal: boolean;

    /**
     * Which placeholder gradient to use while the image is loading.
     * Goes 1-12 right now.
     */
    placeholderGradient: number;
}

export type NavbarCategories = "Docs" | "Explore" | "Tools";

export const NavbarData: {
    title: NavbarCategories,
    items: NavigationContent[]
}[] = [
    {
        title: 'Docs',
        items: [
            {
                title: "Command Atlas",
                subtitle: "Discover the right command, and how to use it.",
                img: undefined,
                icon: Compass,
                iconColor: ThemeVars.gray_300,
                href: '/atlas',
                isInternal: true,
                placeholderGradient: 1
            },
            {
                title: "Official Miza Discord",
                subtitle: "Get direct support. Or just meme at us, we'll vibe.",
                img: undefined,
                icon: LifeBuoy,
                iconColor: ThemeVars.purple_400,
                href: SUPPORT_SERVER_LINK,
                isInternal: false,
                placeholderGradient: 2
            },
            {
                title: "Premium",
                subtitle: "Enable supercharged AI features with a subscription.",
                img: undefined,
                icon: DollarSign,
                iconColor: ThemeVars.yellow_400,
                href: DONATION_LINK,
                isInternal: false,
                placeholderGradient: 3
            }
        ],
    },
    {
        title: 'Explore',
        items: [
            {
                title: "Command Playground",
                subtitle: "Fuck around and find out - without consequences.",
                img: undefined,
                icon: Terminal,
                iconColor: ThemeVars.teal_400,
                href: '/playground',
                isInternal: true,
                placeholderGradient: 4
            },
            {
                title: "Miza Talk",
                subtitle: "Plea for mercy with with your future AI overlord here.",
                img: undefined,
                icon: MessageSquare,
                iconColor: ThemeVars.purple_400,
                href: '/chat',
                isInternal: true,
                placeholderGradient: 5
            },
            {
                title: "Status and Statistics",
                subtitle: "Having problems? It's probably a you thing.",
                img: undefined,
                icon: PieChart,
                iconColor: ThemeVars.yellow_400,
                href: '/status',
                isInternal: true,
                placeholderGradient: 6
            }
        ],
    },
    {
        title: 'Tools',
        items: [
            {
                title: "Filehost",
                subtitle: "Simplify your file sharing problems. Or complicate them. Probably the latter.",
                img: undefined,
                icon: File,
                iconColor: ThemeVars.blue_400,
                href: '/files',
                isInternal: true,
                placeholderGradient: 7
            },
            {
                title: "SpectralPulse",
                subtitle: "Visualize your sound. Shine lasers in your eyes.",
                img: undefined,
                icon: BarChart2,
                iconColor: ThemeVars.yellow_500,
                href: '/spectralpulse',
                isInternal: true,
                placeholderGradient: 8
            },
            {
                title: "Media Downloader",
                subtitle: "Certainly, a media downloader of all time.",
                img: undefined,
                icon: DownloadCloud,
                iconColor: ThemeVars.red_500,
                href: '/downloader',
                isInternal: true,
                placeholderGradient: 9
            }
        ],
    }
]
/**
 * Mizabot pages to have on navbar (sort, categorize)
 
Docs
https://mizabot.xyz/atlas
https://discord.com/invite/cbKQKAr
https://ko-fi.com/mizabot

Explore
https://mizabot.xyz/tester
https://mizabot.xyz/chat
https://mizabot.xyz/mpinsights

Tools
https://mizabot.xyz/files
https://mizabot.xyz/spectralpulse
https://mizabot.xyz/downloader








https://mizabot.xyz/api/status

 */