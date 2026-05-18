import Link from 'next/link';
import Image from 'next/image';
import { Award, Clock } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { Program } from '@/types';

interface ProgramCardProps {
  program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <GlowCard glowColor="orange" customSize className="w-full h-full flex flex-col p-2">
      {/* Image Area */}
      <div className="w-full h-48 rounded-xl bg-slate-100 mb-6 overflow-hidden relative border border-slate-200">
        <Image 
          src={program.image} 
          alt={program.title} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
           <Award className="w-3 h-3 text-green-600" />
           <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wide">Certificate</span>
        </div>
      </div>

      <div className="px-2 flex-grow flex flex-col">
        {/* Meta Header */}
        <div className="flex items-center justify-between mb-3">
           <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full ${program.type === 'Premium' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
             {program.type}
           </span>
           <span className="text-base font-extrabold text-slate-900">{program.price}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{program.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">{program.description}</p>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 mb-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
             <Clock className="w-3.5 h-3.5 text-slate-400" />
             <span className="text-xs font-semibold text-slate-600">{program.duration}</span>
          </div>
        </div>

        <Link 
          href={`/programs/${program.slug || program.id}`} 
          className="w-full py-2.5 border-2 border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center justify-center gap-1 mt-auto"
        >
          View Details
        </Link>
      </div>
    </GlowCard>
  );
}
