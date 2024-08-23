"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { httpBatchLink } from "@trpc/client";

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL_DEV}/api/trpc`,
          async fetch(url, options) {
            const res = await fetch(url, options);
            if (!res.ok) {
              console.error('API error:', await res.text());
            }
            return res;
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;



// "use client";

// import { PropsWithChildren, useState } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { trpc } from "@/app/_trpc/client";
// import { httpBatchLink } from "@trpc/client";

// const Providers = ({ children }: PropsWithChildren) => {
//   const [queryClient] = useState(() => new QueryClient());
//   const [trpcClient] = useState(() =>
//     trpc.createClient({
//       links: [
//         httpBatchLink({
//           url:'http://localhost:3000'
//         }),
//       ],
//     })
//   );

//   return (
//     <trpc.Provider client={trpcClient} queryClient={queryClient}>
//       <QueryClientProvider client={queryClient}>
//         {children}
//       </QueryClientProvider>
//     </trpc.Provider>
//   );
// };

// export default Providers;