import { useEffect, useState } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { Eye, MessageCircle } from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { baseUrl, myAxios } from "../../config";

export function Community() {
  const [communityList, setCommunityList] = useState([]);
  const [pageBtn, setPageBtn] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    allPage: 0,
    curPage: 1,
    endPage: 0,
    startPage: 1,
  });

  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);

  // 내 커뮤니티목록 조회
  const getCommunityList = (page) => {
    myAxios(token, setToken)
      .get(
        "http://localhost:8080" +
          `/my/communityList?username=${user.username}&page=${page}`
      )
      .then((res) => {
        setCommunityList(res.data.myCommunityList);
        return res.data.pageInfo;
      })
      .then((pageData) => {
        setPageInfo(pageData);
        let pageBtns = [];
        for (let i = pageData.startPage; i <= pageData.endPage; i++) {
          pageBtns.push(i);
        }
        setPageBtn([...pageBtns]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCommunityList(1);
  }, []);

  return (
    <div className="mypage-layout">
      <h1 className="mypage-title">내 게시물</h1>

      {communityList.length === 0 ? (
        <div
          style={{
            width: "100%",
            padding: "40px",
            textAlign: "center",
            color: "#6A7685",
            fontSize: "14px",
          }}
        >
          작성한 게시글이 없습니다.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {communityList.map((community) => (
            <a
              href={`/zipddak/community/${community.communityIdx}`}
              className="Com-card"
            >
              <div className="Com-infoBox">
                <div className="Com-info">
                  <span className="Com-category">{community.categoryName}</span>
                  <div className="Com-title">{community.title}</div>
                  <span className="Com-content">{community.content}</span>
                </div>
                <div className="Com-reaction">
                  <span className="Com-writer">{community.writerNickname}</span>
                  {/* <div className="favs">
                    <Eye size={15} />
                    {community.views}
                  </div> */}
                  <i className="bi bi-dot dot"></i>
                  <div className="chats">
                    <MessageCircle size={15} />
                    {community.replyCount}
                  </div>
                </div>
              </div>
              {community.thumbnail && (
                <img
                  src={`${baseUrl}/imageView?type=community&filename=${community.thumbnail}`}
                  width="80px"
                  height="80px"
                />
              )}
            </a>
          ))}
        </div>
      )}

      <Pagination className="my-pagination">
        {pageBtn.map((b) => (
          <PaginationItem key={b} active={b === pageInfo.curPage}>
            <PaginationLink
              onClick={() => {
                setCommunityList([]);
                getCommunityList(b);
              }}
            >
              {b}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>
    </div>
  );
}
