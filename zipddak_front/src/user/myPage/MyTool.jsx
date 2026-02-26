import { MapPin, CirclePlus } from "lucide-react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { MyToolCard } from "../../main/component/Tool";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";
import { useEffect, useState } from "react";
import "../../main/css/Main.css";

export default function MyTool() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [tool, setTool] = useState([]);

    //페이지네이션
    const PAGE_SIZE = 5;

    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const totalPage = Math.ceil(totalCount / PAGE_SIZE);
    const pageBtn = Array.from({ length: totalPage }, (_, i) => i + 1);

    //공구 상태
    const [activeState, setActiveState] = useState(0);

    const myToolList = (page = 1) => {
        const offset = (page - 1) * PAGE_SIZE;

        const params = {
            //유저
            username: user.username,
            //공구 상태
            rentalState: activeState,
            offset,
            size: PAGE_SIZE,
        };

        myAxios(token, setToken)
            .get("/tool/myTool", { params })
            .then((res) => {
                setTool(res.data.cards);
                setTotalCount(res.data.totalCount);
            });
    };

    useEffect(() => {
        setCurrentPage(1);
        myToolList(1);
    }, [activeState]);

    const refreshList = () => {
        myToolList(currentPage);
    };

    return (
        <>
            <div className="card-box">
                <div className="top">
                    <div className="title-box">
                        <div className="mypage-title">
                            <span>공구대여</span>
                        </div>
                    </div>
                    <div className="mypage-chipList">
                        <div className={activeState === 0 ? "mypage-chipList isActive" : "mypage-chipList"} onClick={() => setActiveState(0)}>
                            전체
                        </div>

                        <div className={activeState === 1 ? "mypage-chipList isActive" : "mypage-chipList"} onClick={() => setActiveState(1)}>
                            대여가능
                        </div>

                        <div className={activeState === 2 ? "mypage-chipList isActive" : "mypage-chipList"} onClick={() => setActiveState(2)}>
                            대여중
                        </div>

                        <div className={activeState === 3 ? "mypage-chipList isActive" : "mypage-chipList"} onClick={() => setActiveState(3)}>
                            대여중지
                        </div>
                    </div>
                </div>

                <div className="myToolCards">{Array.isArray(tool) && tool.map((toolCard) => <MyToolCard key={toolCard.toolIdx} tool={toolCard} onChanged={refreshList} />)}</div>

                <Pagination className="my-pagination">
                    {pageBtn.map((p) => (
                        <PaginationItem key={p} active={p === currentPage}>
                            <PaginationLink
                                onClick={() => {
                                    setCurrentPage(p);
                                    myToolList(p);
                                }}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                </Pagination>
            </div>
        </>
    );
}
