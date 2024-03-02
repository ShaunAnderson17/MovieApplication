import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const [initialRedirect, setInitialRedirect] = useState(true);

    useEffect(() => { 
        if (initialRedirect) {
            navigate("/NewReleases");
            setInitialRedirect(false);
        }
    }, [navigate, initialRedirect]);

    return (
        <nav className="nav">
            <ul>
                <CustomLink to="/NewReleases" className="NewReleases">
                    New Releases
                </CustomLink>
                <CustomLink to="/PopularMovies" className="PopularMovies">
                    Popular Movies
                </CustomLink>
                <CustomLink to="/Browse" className="Browse">
                    Browse
                </CustomLink>
                <CustomLink to="/AdvancedSearch" className="AdvancedSearch">
                    Advanced Search
                </CustomLink>
            </ul>
        </nav>
    );
}

interface CustomLinkProps {
    to: string;
    children: React.ReactNode;
    className?: string;
}

function CustomLink({ to, children, ...props }: CustomLinkProps) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active" : ""} style={{ listStyleType: "none" }}>
            <Link to={to} className={props.className} {...props}>
                {children}
            </Link>
        </li>
    );
}