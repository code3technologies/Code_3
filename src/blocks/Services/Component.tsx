import type { ServicesBlock as ServicesBlockProps } from 'src/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { ServicesBlockClient } from './ServicesBlockClient'

export const ServicesBlock: React.FC<
  ServicesBlockProps & { id?: string; maxServices?: number }
> = async (props) => {
  const { id, maxServices = 6 } = props

  const payload = await getPayload({ config: configPromise })

  const servicePages = await payload.find({
    collection: 'pages',
    depth: 1,
    limit: maxServices,
    where: {
      serviceCategory: {
        in: ['infrastructure', 'digital'],
      },
    },
  })

  return (
    <div className="" id={`block-${id}`}>
      {/* Pass fetched data to the client boundary */}
      <ServicesBlockClient {...props} servicePages={servicePages.docs} />
    </div>
  )
}

































// 'use client'

// import type { Media, ServicesBlock as ServicesBlockProps } from 'src/payload-types'

// import { cn } from '@/utilities/ui'
// import Link from 'next/link'
// import React from 'react'
// import { Media as MediaRenderer } from '@/components/Media' // ✅ import your custom Media component

// type Props = {
//   className?: string
// } & ServicesBlockProps

// export const ServicesBlock: React.FC<Props> = ({
//   className,
//   badge = 'OUR SERVICES',
//   title = 'Your Technology Partner in Every Step',
//   subtitle = 'Whether you need a secure IT backbone or a strong digital presence, we provide tailored solutions under one roof.',
//   infraService,
//   digitalService,
// }) => {
//   const currentService = infraService

//   const resolveDetailHref = () => {
//     const detail = currentService?.detailPage
//     if (!detail) return undefined
//     if (typeof detail === 'string') return `/${detail}`
//     const slug = (detail as any)?.slug
//     return slug ? `/${slug}` : undefined
//   }

//   const detailHref = resolveDetailHref()

//   return (
//     <section className={cn('bg-white py-16 lg:py-20 px-4 relative', className)}>
//       {/* Header */}
//       <div className="text-center mb-12">
//         <button className="bg-[#C90E1D] text-white px-3 border border-[#FF3B4B] py-2 rounded-full text-sm font-medium mb-6">
//           {badge}
//         </button>
//         <h1 className="text-3xl md:text-5xl font-semibold leading-[130%] mb-4">{title}</h1>
//         <p className="text-[#535862] max-w-2xl mx-auto">{subtitle}</p>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto">
//         <div className="grid md:grid-cols-2 gap-12 items-stretch">
//           {/* Left Side - Text */}
//           <div className="relative flex flex-col justify-between">
//             <div className="absolute md:block hidden left-0 top-0 bottom-0 w-2 rounded-full bg-gradient-to-b from-[#BE251F] to-transparent"></div>

//             <div className="flex flex-col justify-between gap-5 h-full md:ml-12">
//               <div className="w-16 h-16 bg-[#FF1800] border border-[#FF919A] rounded-full flex items-center justify-center mb-8">
//                 <svg
//                   width="32"
//                   height="32"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
//                     stroke="white"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </div>

//               <div className="transition-all duration-500 ease-in-out">
//                 <span className="inline-block bg-[#F5D9D9] text-red-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
//                   {currentService?.label}
//                 </span>
//                 {detailHref ? (
//                   <Link
//                     href={detailHref}
//                     className="text-3xl md:text-4xl font-semibold text-[#0D121C] mb-6 transition-opacity duration-500 hover:text-red-600"
//                   >
//                     {currentService?.title}
//                   </Link>
//                 ) : (
//                   <h2 className="text-3xl md:text-4xl font-semibold text-[#0D121C] mb-6 transition-opacity duration-500">
//                     {currentService?.title}
//                   </h2>
//                 )}
//                 <p className="text-gray-600 text-lg leading-relaxed transition-opacity duration-500">
//                   {currentService?.description}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Image via Media */}
//           <div className="relative w-full rounded-3xl overflow-hidden transition-all duration-500">
//             {currentService?.image ? (
//               <div className="relative aspect-[3/2] w-full h-full">
//                 <MediaRenderer
//                   resource={currentService.image}
//                   fill
//                   imgClassName="object-cover w-full h-full transition-all duration-700 ease-in-out"
//                   priority
//                 />
//               </div>
//             ) : (
//               <div
//                 className="absolute w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
//                 style={{
//                   backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }