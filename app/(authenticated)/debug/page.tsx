export default async function DebugPage() {
    
    return (
        <>
            <div className="flex flex-wrap gap-3">
                <div className="text-center">
                    <div className="h-20 w-20 bg-success"></div>
                    Success
                </div>
                <div className="text-center">
                    <div className="h-20 w-20 bg-destructive"></div>
                    Destructive
                </div>
                <div className="text-center">
                    <div className="h-20 w-20 bg-primary"></div>
                    Primary
                </div>
                <div className="text-center">
                    <div className="h-20 w-20 bg-secondary"></div>
                    Secondary
                </div>
                <div className="text-center">
                    <div className="h-20 w-20 bg-border"></div>
                    Border
                </div>
                <div className="text-center">
                    <div className="h-20 w-20 bg-foreground"></div>
                    Foreground
                </div>
                <div className="text-center">
                    <div className="h-20 w-20 bg-yellow"></div>
                    Yellow
                </div>
                <div className="text-center">
                    <div className="h-20 w-20 bg-violet"></div>
                    Violet
                </div>
                <div className="text-center">
                    <div className="h-20 w-20 bg-blue"></div>
                    Blue
                </div>
                <div className="text-center">
                    <div className="h-20 w-20 bg-orange"></div>
                    Orange
                </div>
            </div>
        </>
    );
}
