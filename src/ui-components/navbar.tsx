import { useImperativeHandle } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navbar() {
     
    return (
        <nav className="nav">
            <Link to="/" className="MovieTitle">Movie App</Link>
            <ul>
                <CustomLink to="/NewReleases" className="NewReleases">New Releases</CustomLink>
                <CustomLink to="/Browse" className="Browse">Browse</CustomLink>
                <CustomLink to="/AdvancedSearch" className="AdvancedSearch">Advanced Search</CustomLink>

            </ul>
        </nav>
    )
}
 
interface CustomLinkProps {
    to: string;
    children: React.ReactNode;
    className?: string;
}
 
function CustomLink({ to, children, ...props }: CustomLinkProps) { 
    const resolvedPath = useResolvedPath(to) 
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
     
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} className={props.className} {...props}>
                {children}
            </Link>
        </li>
    );
} 