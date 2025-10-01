'use client';

import { motion } from 'framer-motion';
import { Crown, User, Calendar } from 'lucide-react';
import clsx from 'clsx';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'host' | 'member';
  joinedAt: string;
  status: 'active' | 'inactive';
}

interface MembersListProps {
  members: Member[];
  className?: string;
}

export function MembersList({ members, className }: MembersListProps) {
  return (
    <div className={clsx('space-y-3', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Pool Members</h3>
        <span className="text-sm text-muted">{members.length} members</span>
      </div>

      <div className="space-y-2">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={clsx(
              'flex items-center gap-4 p-4 rounded-xl',
              'backdrop-blur-md bg-white/5 border border-white/10',
              'hover:bg-white/10 transition-all duration-300',
              'group cursor-pointer'
            )}
          >
            {/* Avatar */}
            <div className="relative">
              <div className={clsx(
                'w-12 h-12 rounded-full flex items-center justify-center',
                'bg-gradient-to-br from-primary/20 to-secondary/20',
                'border-2',
                member.role === 'host' ? 'border-primary' : 'border-white/20'
              )}>
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-muted" />
                )}
              </div>
              
              {/* Role Badge */}
              {member.role === 'host' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-glow"
                >
                  <Crown className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </div>

            {/* Member Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold truncate">{member.name}</h4>
                {member.role === 'host' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                    Host
                  </span>
                )}
              </div>
              <p className="text-sm text-muted truncate">{member.email}</p>
              <div className="flex items-center gap-1 text-xs text-muted mt-1">
                <Calendar className="w-3 h-3" />
                <span>Joined {member.joinedAt}</span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <div className={clsx(
                'w-2 h-2 rounded-full',
                member.status === 'active' ? 'bg-secondary animate-pulse' : 'bg-muted/30'
              )} />
              <span className="text-xs text-muted hidden md:block">
                {member.status === 'active' ? 'Active' : 'Offline'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
