import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/Community.css";
import { Eye, MessageCircle, Heart } from "lucide-react";
import { useNavigate } from "react-router";

export function Community({ community }) {
    const navigate = useNavigate();

    return (
        <a
            onClick={() => {
                navigate(`/zipddak/community/${community?.communityId}`);
            }}
            className="Com-card"
        >
            <div className="Com-infoBox">
                <div className="Com-info">
                    <span className="Com-category">{community?.categoryName}</span>
                    <div className="Com-title">{community?.title}</div>
                    <span className="Com-content">
                        {community?.content?.length > 40
                             ? community.content.slice(0, 40) + "..."
                             : community?.content}
                    </span>
                </div>
                <div className="Com-reaction">
                    <span className="Com-writer">{community?.nickname}</span>
                    {/* <i className="bi bi-dot dot"></i>
                    <div className="favs">
                        <Eye size={15} />
                        {community?.viewCount}
                    </div> */}
                    <i className="bi bi-dot dot"></i>
                    <div className="chats">
                        <MessageCircle size={15} />
                        {community?.replyCount}
                    </div>
                    <i className="bi bi-dot dot"></i>
                    <div className="favs">
                        <Heart size={17} />
                        {community?.favoriteCount}
                    </div>
                </div>
            </div>
            {community?.img1?
            <img src={`http://localhost:8080/imageView?type=community&filename=${community?.img1}`} className="Com-image"/>
            :
            <img src="/zipddak_no_img.png" className="Com-image"/>
            }
        </a>
    );
}
