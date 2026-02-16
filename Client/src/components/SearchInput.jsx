import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useBlogStore } from "@/store/useBlogStore";
import { useNavigate, useLocation } from "react-router-dom";
import { RouteIndex } from "@/helpers/Route";

const SearchInput = () => {
    const [query, setQuery] = useState("");
    const { fetchBlogs } = useBlogStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim() !== "") {
                // Redirect to home if not already there to show results
                if (location.pathname !== RouteIndex && !location.pathname.startsWith('/category/')) {
                    navigate(RouteIndex);
                }
                fetchBlogs(null, query);
            } else if (query === "" && location.pathname === RouteIndex) {
                // Fetch all blogs if search is cleared while on home page
                fetchBlogs();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, fetchBlogs, navigate, location.pathname]);

    return (
        <div className="relative w-full group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search className="h-4 w-4" />
            </div>
            <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles by title or content..."
                className="w-full pl-9 pr-10 h-10 rounded-xl bg-muted/50 border-muted-foreground/10 focus:bg-background transition-all"
            />
            {query && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuery("")}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-muted"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </Button>
            )}
        </div>
    )
}

export default SearchInput;