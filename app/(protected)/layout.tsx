import Navbar from "./_components/navbar";

interface ProtectedLayoutProps {
    children:React.ReactNode;
}

const ProtectedLayout = ({children}: ProtectedLayoutProps) => {
    return (  
        <div className="h-full w-full flex flex-col gap-y-10 justify-center items-center bg-sky-400 ">
<Navbar/>
            {children}
        </div>
    );
}
 
export default ProtectedLayout