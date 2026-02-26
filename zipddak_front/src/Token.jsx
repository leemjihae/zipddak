import { fcmTokenAtom, tokenAtom, userAtom } from "./atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios } from "./config";

export default function Token() {
    // let params = new URL(window.location.href).searchParams;
    // let tokenParam = params.get("token");

    const tokenParam = new URLSearchParams(window.location.search).get("token");
    let setUser = useSetAtom(userAtom);
    let [token, setToken] = useAtom(tokenAtom);

    let fcmToken = useAtomValue(fcmTokenAtom);

    // console.log(tokenParam);
    const navigate = useNavigate();
    // navigate("/zipddak/main");

    useEffect(() => {
        setToken(tokenParam);
    }, []);

    useEffect(() => {
        let formData = new FormData();
        formData.append("fcmToken", fcmToken);
        token &&
            myAxios(token, setToken)
                .post("/user", formData)

                .then((res) => {
                    console.log("==================");
                    console.log(res);
                    setUser(res.data);
                    navigate("/zipddak/main");
                    // navigate("/signUp/user");
                })
                .catch((err) => {
                    console.log(err);
                });
    }, [token]);

    return <></>;
}
