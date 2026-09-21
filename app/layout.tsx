import type { Metadata } from "next";
import {
  IM_Fell_DW_Pica,
  IM_Fell_English,
  IM_Fell_English_SC,
  UnifrakturCook,
} from "next/font/google";
import { Footer } from "@/components/footer";
import { PageAnimator } from "@/components/page-animator";
import { Providers } from "@/components/providers";
import "./globals.css";

const fellEnglish = IM_Fell_English({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-im-fell-english",
});

const fellSmallCaps = IM_Fell_English_SC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-im-fell-sc",
});

const fellPica = IM_Fell_DW_Pica({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-im-fell-pica",
});

const unifraktur = UnifrakturCook({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-unifraktur",
});

export const metadata: Metadata = {
  title: {
    default: "Word Hoard",
    template: "%s · Word Hoard",
  },
  description:
    "A daily gazette of words, gathered from every tongue and every age. One word, delivered each morning at nine.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fellEnglish.variable} ${fellSmallCaps.variable} ${fellPica.variable} ${unifraktur.variable}`}
    >
      <head>
        {/* Animated elements start hidden; without JS nothing would reveal them. */}
        <noscript>
          <style>{"[data-anim],[data-char]{opacity:1 !important}"}</style>
        </noscript>
      </head>
      <body className="bg-paper font-body text-ink antialiased">
        {/* Page margin, then the ruled broadsheet frame */}
        <div className="min-h-dvh p-3.5 lg:px-12 lg:py-9">
          <div className="flex min-h-[calc(100dvh-28px)] flex-col border-[3px] border-double border-ink px-[18px] pt-3.5 pb-5 lg:min-h-[calc(100dvh-72px)] lg:border-4 lg:px-10 lg:pt-5 lg:pb-6">
            <Providers>
              <PageAnimator>
                {children}
                <Footer />
              </PageAnimator>
            </Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
