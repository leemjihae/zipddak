import { useEffect } from "react";
import { Title } from "react-head";

export default function usePageTitle(pageTitle) {
    useEffect(() => {
        // fallback: react-head가 없거나 실패할 경우 대비
        document.pageTitle = pageTitle;
    }, [pageTitle]);

    // react-head Title 반환
    return <Title>{pageTitle}</Title>;
}
