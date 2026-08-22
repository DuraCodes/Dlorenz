import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, RefreshCw, Activity, CheckCircle2, User, Database, Film, Mail } from 'lucide-react';
import { ActivityLogItem, apiGetActivityLogs } from '../../lib/api';

export const ActivityLogsTab: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await apiGetActivityLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionIcon = (entityType: string) => {
    switch (entityType) {
      case 'auth':
        return <User className="w-4 h-4 text-purple-400" />;
      case 'site_config':
        return <Database className="w-4 h-4 text-blue-400" />;
      case 'gallery':
      case 'media':
        return <Film className="w-4 h-4 text-[#4EFE32]" />;
      case 'inquiry':
        return <Mail className="w-4 h-4 text-amber-400" />;
      default:
        return <Activity className="w-4 h-4 text-[#A0A6B2]" />;
    }
  };

  return (
    <div className="space-y-6 font-condensed">
      <div className="flex items-center justify-between pb-4 border-b border-[#262933]">
        <div>
          <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#4EFE32]" />
            <span>Executive Audit Trail & System Logs</span>
          </h3>
          <p className="text-xs text-[#A0A6B2] mt-0.5">
            Immutable audit log of all admin activities, logins, configuration updates, and lead management events.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-lg bg-[#111216] border border-[#262933] hover:border-[#4EFE32] text-xs font-bold uppercase text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#4EFE32] ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-[#16181D] border border-[#262933] rounded-3xl p-5 sm:p-6 space-y-4">
        {isLoading ? (
          <div className="py-12 flex justify-center text-xs text-[#A0A6B2] uppercase font-bold">
            Loading activity stream...
          </div>
        ) : logs.length > 0 ? (
          <div className="divide-y divide-[#262933]/60">
            {logs.map((log) => (
              <div key={log.id} className="py-3.5 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#111216] border border-[#262933] flex items-center justify-center shrink-0 mt-0.5">
                    {getActionIcon(log.entityType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-[#111216] text-[#A0A6B2] font-mono uppercase">
                        {log.entityType}
                      </span>
                    </div>
                    <p className="text-xs text-[#A0A6B2] mt-0.5">{log.details}</p>
                    {log.actorEmail && (
                      <span className="text-[10px] text-[#505664]">Actor: {log.actorEmail}</span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-[#505664] font-mono shrink-0 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[#A0A6B2]">No activity logs recorded yet.</div>
        )}
      </div>
    </div>
  );
};
