import { FC } from "react"

//Outletをインポート
import { Outlet } from 'react-router-dom';
import Header from "./Header";


const Layout: FC = () => {


    return (
        <>
            <header>
                <Header />
            </header>

            <main className="container mx-auto mt-5">
                <Outlet />
            </main>

            <footer>
            </footer>
        </>
    )

}

export default Layout;