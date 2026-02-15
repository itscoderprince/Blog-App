import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SearchInput = () => {
    return (
        <div className="relative w-full">
            <Input
                type="text"
                placeholder="Search articles..."
                className="w-full pr-10 h-9 rounded-full"
            />
            <Button size="icon" className="absolute right-1 top-1 h-7 w-7 rounded-full bg-primary hover:bg-primary/80">
                <Search className="h-4 w-4" />
            </Button>
        </div>
    )
}

export default SearchInput;