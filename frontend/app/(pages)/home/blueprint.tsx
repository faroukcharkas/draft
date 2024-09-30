export default function HomePageBlueprint({ children, title, iconName, headerComponents }: { children: React.ReactNode, title: string, iconName: string, headerComponents?: React.ReactNode }) {
    return (
      <div className="flex flex-col flex-1 bg-background rounded-xl">
        <header className="flex h-[60px] py-5 px-8 items-center border-b">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="material-symbols-rounded text-muted-foreground">{iconName}</span>
            {title}
          </h1>
          {headerComponents && (
            <div className="ml-auto">
              {headerComponents}
            </div>
          )}
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    );
  }