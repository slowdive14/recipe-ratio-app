import { Metadata } from "next";
import { OfflineContent } from "@/components/ui/OfflineContent";

export const metadata: Metadata = {
    title: "오프라인 - 레시피 비율 계산기",
};

export default function OfflinePage() {
    return <OfflineContent />;
}

