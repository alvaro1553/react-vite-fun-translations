import { useState } from "react";
export function WelcomePage(props: { children?: React.ReactNode }) {
  const { children } = props;

  const folderStructureBeforeFolded = `project/
├─ app/
│  └─ ...
├─ domain/
│  └─ ...
├─ io/
│  └─ ...
├─ view/
│  └─ ...
├─ package.json
└─ package-lock.json`;

  const folderStructureBeforeFull = `project/
├─ app/
│  ├─ routes/
│  ├─ translate/
│  │  └─ form.tsx
│  ├─ welcome/
│  │  ├─ logo-dark.svg
│  │  ├─ logo-light.svg
│  │  └─ welcome.tsx
│  ├─ app.css
│  ├─ root.tsx
│  └─ routes.ts
├─ domain/
│  └─ types/
│     ├─ Engine.ts
│     └─ Translation.ts
├─ io/
│  ├─ codec/
│  │  └─ fun-translation.ts
│  ├─ mocks/
│  │  └─ api.funtranslations.com_translate_yoda.json.json
│  ├─ repo/
│  │  └─ YodaTranslationRepo.ts
│  └─ service/
│     ├─ CacheService.ts
│     └─ FunTranslationService.ts
├─ view/
│  └─ components/
│     ├─ Button.tsx
│     ├─ Content.tsx
│     ├─ Input.tsx
│     └─ Sidepane.tsx
├─ package.json
└─ package-lock.json`

  const folderStructureAfterFullFolded = `project/
├─src/
  ├─ client/            <- UI/view (encapsulated)
  │  ├─ components/     <- Atomic Design
  │  │  ├─ atoms/       <- e.g. Button.tsx, Input.tsx, ...
  │  │  ├─ molecules/   <- e.g. Form.tsx, ...
  │  │  └─ pages/       <- e.g. WelcomePage.tsx, ...
  │  └─ ...
  ├─ server/
  │  ├─ adapter/        <- Top layer: adapt/map external services e.g. Postgres, AWS-S3, etc.  
  │  ├─ repo/           <- Middle layer: abstract usage of db collections/tables
  │  └─ service/        <- Lower layer: orchestrates application logic
  └─ shared/            <- Bottom layer: business logic that depends on nothing (shared by client and server)
├─ package.json
└─ package-lock.json`;

  const folderStructureAfterFull = `project/
├─src/
  ├─ client/            <- UI/view (encapsulated)
  │  ├─ components/     <- Atomic Design
  │  │  ├─ atoms/       <- e.g. Button.tsx, Input.tsx, ...
  │  │  ├─ molecules/   <- e.g. Form.tsx, ...
  │  │  └─ pages/       <- e.g. WelcomePage.tsx, ...
  │  ├─ routes/              
  │  ├─ root.css
  │  ├─ root.tsx
  │  └─ routes.ts
  ├─ server/
  │  ├─ adapter/        <- Top layer: adapt/map external services e.g. Postgres, AWS-S3, etc.  
  │  │  ├─ DatabaseAdapter.ts
  │  │  └─ TranslationAPI.ts
  │  ├─ repo/           <- Middle layer e.g. abstract usage of collections/tables
  │  │  └─ TranslationRepo.ts
  │  └─ service/        <- Lower layer: orchestrate adapters/repo (i.e. layer below) 
  │     └─ TranslationService.ts 
  └─ shared/
     ├─ entities/       <- Bottom layer i.e. app logic that depends on nothing (shared by client and server)
     │  ├─ Translation.ts
     │  └─ TranslationError.ts
     └─ utils/          <- Bottom layer i.e. unrelated logic that depends on nothing (shared across projects)
        ├─ Env.ts
        ├─ Obj.ts
        └─ ...
├─ package.json
└─ package-lock.json`

  const [showFullBefore, setShowFullBefore] = useState(false);
  const [showFullAfter, setShowFullAfter] = useState(false);

  const wrapTree = (s: string) => (
    <>
      {Array.from(s).map((ch, idx) => {
        const isTree = "│├└─".includes(ch);
        return <span key={idx} className={isTree ? "tree-line" : undefined}>{ch}</span>;
      })}
    </>
  );

  function renderFolderTree(tree: string, caption?: string) {
    return (
      <figure className="relative w-full">
        {caption && (
          <figcaption className="mb-2 text-xs text-zinc-500">{caption}</figcaption>
        )}
        <div className="relative rounded-md border bg-zinc-50">
          <pre className="p-4 overflow-x-auto text-sm leading-6">
            <code>
              {tree.split("\n").map((line, i) => {
                let content: any = wrapTree(line);
                // Match a folder name ending with '/' and allow any suffix (e.g., comments like "<- ...")
                const m = line.match(/^(.*?)([A-Za-z0-9._-]+)\/(.*)$/);
                if (m) {
                  const prefix = m[1];
                  const name = m[2];
                  const suffix = m[3] ?? "";
                  content = (
                    <>
                      {wrapTree(prefix)}
                      <span className="folder">{name}</span>/{wrapTree(suffix)}
                    </>
                  );
                }
                return (
                  <div key={i} className="whitespace-pre">
                    {content}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      </figure>
    );
  }

  // Lightweight TypeScript code highlighting without external deps
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  function highlightTs(src: string): string {
    let s = escapeHtml(src);

    type Ph = { key: string; html: string };
    const placeholders: Ph[] = [];
    const place = (regex: RegExp, cls: string) => {
      s = s.replace(regex, (m) => {
        const key = `__${cls.toUpperCase()}_${placeholders.length}__`;
        placeholders.push({ key, html: `<span class=\"ts-${cls}\">${m}</span>` });
        return key;
      });
    };

    // Extract comments and strings first to avoid inner replacements
    place(/\/\*[\s\S]*?\*\//g, "comment");
    place(/\/\/.*$/gm, "comment");
    place(/(["'`])(?:\\.|(?!\1)[\s\S])*\1/g, "string");

    // Keywords
    s = s.replace(/\b(async|await|class|interface|type|export|import|from|extends|implements|new|function|const|let|return|if|else|try|catch|finally|throw|switch|case|break)\b/g, '<span class="ts-kw">$1</span>');

    // Reserved constants
    s = s.replace(/\b(null|undefined|true|false|NaN|Infinity)\b/g, '<span class="ts-const">$1</span>');

    // Numbers
    s = s.replace(/\b\d+(?:_\d+)*(?:\.\d+)?\b/g, '<span class="ts-number">$&</span>');

    // Capitalized identifiers as types
    s = s.replace(/\b[A-Z][A-Za-z0-9_]*\b/g, '<span class="ts-type">$&</span>');

    // Method calls: .methodName(
    s = s.replace(/\.([A-Za-z_$][\w$]*)\s*(?=\()/g, '.<span class="ts-fn">$1</span>');

    // Object properties (not followed by '(')
    s = s.replace(/\.([A-Za-z_$][\w$]*)\b(?!\s*\()/g, '.<span class="ts-prop">$1</span>');

    // Standalone function calls: fnName(
    s = s.replace(/(^|[^.\w$])([A-Za-z_$][\w$]*)\s*(?=\()/g, '$1<span class="ts-fn">$2</span>');

    // Restore placeholders
    placeholders.forEach((p) => {
      s = s.replace(p.key, p.html);
    });

    return s;
  }

  function CodeBlockTs({ code }: { code: string }) {
    const html = highlightTs(code);
    return (
      <pre className="p-4 overflow-x-auto rounded-md bg-zinc-900 text-zinc-50 text-sm">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-zinc-800">
      <section className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl leading-[1.15] md:leading-[1.15] pb-1 font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 drop-shadow-sm">
          Challenge complete ! 🚀
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-zinc-600 max-w-3xl">
          A tiny tour through the requirements and the solution
        </p>
        <div className="mt-8 w-full max-w-2xl text-left" aria-labelledby="req-title">
          <h2 id="req-title" className="text-xl font-semibold text-zinc-700">Assignment</h2>
          <ul className="mt-3 space-y-3">
            <li>
              <details className="group rounded-lg border border-zinc-200 bg-white/70 backdrop-blur hover:bg-white open:shadow-md transition">
                <summary className="cursor-pointer select-none p-4 marker:content-[''] flex items-center gap-3">
                  <input type="checkbox" checked readOnly className="h-4 w-4 rounded border-green-400 text-green-600 focus:ring-0" aria-label="Bring the app in a working state" />
                  <span>Bring the app to a working state</span>
                  <span className="ml-auto text-xs text-zinc-500 group-open:hidden">click to expand</span>
                  <span className="ml-auto text-xs text-zinc-500 hidden group-open:inline">click to collapse</span>
                </summary>
                <div className="px-4 pb-4 space-y-3 text-sm text-zinc-600">
                  <p>The app was modified/expanded as little as possible to keep it easier to understand.</p>
                  <p>Check below the client's core logic (Folder structure explained in the next item).</p>
                  <CodeBlockTs code={`// src/routes/translate.tsx
                  
// Load a history with every translation ever made
export async function loader({}: Route.LoaderArgs) {
  const translationService = getTranslationServiceSingleton();
  const history = await translationService.getHistory();
  return { history };
}

// Submit the text translation, or delete an entry from the history
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("_intent");
  const translationService = getTranslationServiceSingleton();

  if (intent === "delete_history") {
    const id = formData.get("id");
    /* ... stuff to validate id ... */
    await translationService.removeHistoryEntry(id);
    return { error: null };
  }

  const text = formData.get("text");
  const engine = formData.get("engine");
  /* ... stuff to validate text and engine ... */
  
  const translation = await translationService.getTranslationOrCached(text, { engine });
  /* ... stuff to handle translation errors ... */

  return { error: null, translated: translation.translatedText };
}

// The solution (clean architecture): inversion of control and atomic design separates the app's logic from the view 
export default function Translate(props: Route.ComponentProps) {...}
`} />
                </div>
              </details>
            </li>

            <li>
              <details className="group rounded-lg border border-zinc-200 bg-white/70 backdrop-blur hover:bg-white open:shadow-md transition">
                <summary className="cursor-pointer select-none p-4 marker:content-[''] flex items-center gap-3">
                  <input type="checkbox" checked readOnly className="h-4 w-4 rounded border-green-400 text-green-600 focus:ring-0" aria-label="Clean Architecture" />
                  <span>Clean Architecture</span>
                </summary>
                <div className="px-4 pb-4">
                  <p className="mb-3 text-sm text-zinc-600">
                    The initial folder structure has some issues:
                  </p>
                  <ul className="mb-4 ml-5 list-disc text-sm text-zinc-600">
                    <li>It mixes app modules and config. Suggested: encapsulate src code in src/</li>
                    <li>It doesn't separate concerns. Suggested: split into client/, server/ and shared/</li>
                    <li>It doesn't fully comply with a clean architecture<br/>e.g. service/ is placed inside io/, but service is not input-output<br/>e.g. the ui is scattered across app/ and view/<br/> e.g. YodaTranslationRepo.ts has nothing to do with db/storage yet is suffixed 'Repo'</li>
                    <li>It doesn't architecture components. Suggested: atomic design (atoms, molecules, etc).</li>
                  </ul>
                  <p className="mb-3 text-sm text-zinc-600">
                    Improved folder structure that fully complies with a clean architecture:
                  </p>
                  <div className="flex gap-2 justify-center ">
                    <div className="min-w-0 basis-0 flex-1">
                      {renderFolderTree(showFullBefore ? folderStructureBeforeFull : folderStructureBeforeFolded, "Initial folder structure")}
                      <button
                        type="button"
                        aria-expanded={showFullBefore}
                        onClick={() => setShowFullBefore((v) => !v)}
                        className="mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                      >
                        {showFullBefore ? 'Hide full tree' : 'Show full tree'}
                      </button>
                    </div>
                    <div className="min-w-0 basis-0 flex-1">
                      {renderFolderTree(showFullAfter ? folderStructureAfterFull : folderStructureAfterFullFolded, "Improved folder structure")}
                      <button
                        type="button"
                        aria-expanded={showFullAfter}
                        onClick={() => setShowFullAfter((v) => !v)}
                        className="mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                      >
                        {showFullAfter ? 'Hide full tree' : 'Show full tree'}
                      </button>
                    </div>
                  </div>
                </div>
              </details>
            </li>

            <li>
              <details className="group rounded-lg border border-zinc-200 bg-white/70 backdrop-blur hover:bg-white open:shadow-md transition">
                <summary className="cursor-pointer select-none p-4 marker:content-[''] flex items-center gap-3">
                  <input type="checkbox" checked readOnly className="h-4 w-4 rounded border-green-400 text-green-600 focus:ring-0" aria-label="Clean Architecture" />
                  <span>Submit the form to show the text translation</span>
                </summary>
                <div className="px-4 pb-4 space-y-3 text-sm text-zinc-600">
                  <p>The UI/view also follows a clean architecture: InputForm is a molecule-component (top-layer) that knows nothing about the app logic (submission/state/etc.) handled by a route-component (lower-layer)</p>
                  <CodeBlockTs code={`// src/routes/translate.tsx
<InputForm
  component={fetcher.Form}
  method='POST'
  action='/translate'
  submitLabel={loading ? 'Translating...' : 'Translate'}
  submitLoading={loading}
  submitSuccess={fetcher.data?.translated}
  submitError={fetcher.data?.error}
  menuLabel="Engine:"
  menuOptions={menuItems}
  menuActiveKey={engine}
  onMenuSelect={(key) => setEngine(key as TranslationEngine)}
/>`} />
                </div>
              </details>
            </li>

            <li>
              <details className="group rounded-lg border border-zinc-200 bg-white/70 backdrop-blur hover:bg-white open:shadow-md transition">
                <summary className="cursor-pointer select-none p-4 marker:content-[''] flex items-center gap-3">
                  <input type="checkbox" checked readOnly className="h-4 w-4 rounded border-green-400 text-green-600 focus:ring-0" aria-label="Multiple engines" />
                  <span>Multiple translation engines</span>
                </summary>
                <div className="px-4 pb-4 space-y-3 text-sm text-zinc-600">
                  <p>Choose Yoda, Pirate, or Alvaro's playful engine. The last engine runs in the solution's server in case you reach the fun-translations-api limit (10 requests) of the first two engines.</p>
                  <CodeBlockTs code={`// src/routes/translate.tsx
const ENGINE_LABELS: Record<TranslationEngine, string> = {
  yoda: 'Yoda',
  pirate: 'Pirate',
  alvaro: "Alvaro's",
};
const menuItems = Engines.map((e) => ({ key: e, label: ENGINE_LABELS[e] }));`} />
                </div>
              </details>
            </li>

            <li>
              <details className="group rounded-lg border border-zinc-200 bg-white/70 backdrop-blur hover:bg-white open:shadow-md transition">
                <summary className="cursor-pointer select-none p-4 marker:content-[''] flex items-center gap-3">
                  <input type="checkbox" checked readOnly className="h-4 w-4 rounded border-green-400 text-green-600 focus:ring-0" aria-label="Cache the translations API" />
                  <span>Cache the translations API</span>
                </summary>
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-zinc-600">A second request with the same text and engine is retrieved from an in-memory cache, which is invalidated after 5 mins by default.</p>
                  <CodeBlockTs code={`// src/server/service/TranslationService.tsx
async getTranslationOrCached(text, options) {
  const { invalidateCacheInMS = 1000 * 60 * 5, engine } = options;

  const key = this.getCacheKey(text, engine);
  const cached = this.cache.get(key);
  if (cached) {
    // For simplicity, the order in the db table/collection is the order in the 'Recent Translations History'. 
    await this.repo.insertOrMoveToTop(cached);
    return cached;
  }

  let translation: Translation | TranslationError;
  if (engine === 'alvaro') {
    translation = this.alvarize(text);
  } else {
    translation = await this.api.getTranslation(text, engine);
  }

  if (isTranslationError(translation)) {
    return translation;
  }

  this.cache.set(key, translation, invalidateCacheInMS);
  await this.repo.insertOrMoveToTop(translation);
  return translation;
}
`} />
                </div>
              </details>
            </li>

            <li>
              <details className="group rounded-lg border border-zinc-200 bg-white/70 backdrop-blur hover:bg-white open:shadow-md transition">
                <summary className="cursor-pointer select-none p-4 marker:content-[''] flex items-center gap-3">
                  <input type="checkbox" checked readOnly className="h-4 w-4 rounded border-green-400 text-green-600 focus:ring-0" aria-label="History of translations" />
                  <span>History of translations</span>
                </summary>
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-zinc-600">Recent translations are stored in a tiny in-memory DB, which can easily be replaced by a production-ready RDBMS thanks to its adapter's inversion of control.</p>
                  <CodeBlockTs code={`// src/shared/utils/InMemoryDB.ts

// Generic DB driver e.g. postgres ORM, mongo driver, in-memory driver, etc. i.e. top-layer (sharable across projects)
export interface DatabaseDriver {
  getAll<T>(collection: Collection): Promise<DBRecord<T>[]>;
  insert<T>(collection: Collection, record: T): Promise<DBRecord<T>>;
  remove<T>(collection: Collection, match: (r: T) => boolean): Promise<void>;
}

// Naive implementation to be used as a default value i.e. top-layer (sharable across projects)
export class InMemoryDB implements DatabaseDriver {
  #store = new Map<Collection, DBRecord<any>[]>([["translations", initial]]);
  async getAll<T>(collection: Collection): Promise<DBRecord<T>[]> {...}
  async insert<T>(collection: Collection, record: T): Promise<DBRecord<T>> {...}
  async remove<T>(collection: Collection, match: (r: T) => boolean): Promise<void> {...}
  private getOrCreateCollection(collection: Collection): DBRecord<any>[] {...}
  
// src/server/adapter/DatabaseAdapter.ts

// Adapter that encapsulates the db-driver details i.e. lower-layer (sharable by every usage of the DB)
export class DatabaseAdapter {
  driver: DatabaseDriver;
  constructor(options: DatabaseAdapterOptions) {..}
  getAll<T>(collection: string) {..}
  insert<T>(collection: string, record: T) {..}
  remove<T>(collection: string, match: (record: T) => boolean) {..}
}

// src/server/repo/TranslationRepo.ts

// Adapter that encapsulates the Translation collection/table details i.e. lower-lower-layer (sharable by every usage of the Translation collection/table)
export class TranslationRepo {
  #db: DatabaseAdapter;
  constructor(options: TranslationRepoOptions) {..}
  async getAll(): Promise<Translation[]> {..}
  async insertOrMoveToTop(translation: Translation): Promise<void> {..}
  async removeByKey(key: TranslationKey): Promise<void> {..}
}
`


                  } />
                </div>
              </details>
            </li>
          </ul>
        </div>
        <div className="mt-10 w-full max-w-2xl text-left">
          { children }
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white/60 backdrop-blur">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-zinc-600">
          <p>
            Don't forget to email Alvaro — he really enjoyed the exercise and would love to chat about the architectural decisions that were made.
            {" "}
            <a href="mailto:alvaro.gp94@gmail.com" className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2">Say hello</a>
            .
          </p>
        </div>
      </footer>

      <style>{`
        .folder { color: #3730a3; font-weight: 700; }
        .tree-line { color: #9ca3af; }
        code, pre code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .ts-kw { color: #a78bfa; }
        .ts-string { color: #fca5a5; }
        .ts-number { color: #fdba74; }
        .ts-type { color: #7dd3fc; }
        .ts-comment { color: #9ca3af; font-style: italic; }
        .ts-const { color: #86efac; }
        .ts-fn { color: #f9a8d4; }
        .ts-prop { color: #c4b5fd; }
      `}</style>
    </main>
  );
}