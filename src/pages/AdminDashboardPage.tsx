import { useState, useMemo, useEffect } from "react";
import { 
  Users, 
  LayoutDashboard, 
  ShieldCheck, 
  Search,
  Loader2,
  CalendarDays,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { listUsersAdmin, updateUserStatusAdmin } from "../shared/api/userClient";
import { listEventsAdmin } from "../shared/api/eventClient";
import { toast } from "react-hot-toast";
import { seedSampleData } from "../shared/utils/seedData";

// Types
type Tab = "overview" | "users" | "events";

type UserRecord = {
  id?: string;
  _id: string;
  name: string;
  email: string;
  role: "ATTENDEE" | "VENDOR" | "PLANNER" | "ADMIN";
  status: string;
  createdAt: string;
};

type SelectedVendor = {
  vendorId: string;
  serviceId: string;
  price: number;
  category?: string;
  vendorNameSnapshot?: string;
  serviceNameSnapshot?: string;
};

type EventRecord = {
  _id: string;
  title: string;
  status: string;
  startDateTime: string;
  organizerId: string;
  budget?: {
    platformFee: number;
    total: number;
    currency: string;
  };
  selectedVendors: SelectedVendor[];
};

type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  activeEvents: number;
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, eventsRes] = await Promise.all([
        listUsersAdmin().catch(err => {
          console.error("Failed to fetch users", err);
          return [];
        }),
        listEventsAdmin().catch(err => {
          console.error("Failed to fetch events", err);
          return { data: [] };
        })
      ]);
      
      setUsers(Array.isArray(usersRes) ? usersRes : []);
      setEvents(Array.isArray(eventsRes?.data) ? eventsRes.data : []);
    } catch (error: unknown) {
      toast.error("Failed to fetch dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    try {
      await updateUserStatusAdmin(userId, newStatus);
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      toast.success(`User ${newStatus === "ACTIVE" ? "unblocked" : "blocked"} successfully`);
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const filteredUsers = useMemo(() => {
    const safeUsers = Array.isArray(users) ? users : [];
    const validRoles = safeUsers.filter(u => u.role === "VENDOR" || u.role === "PLANNER");
    if (!searchTerm) return validRoles;
    return validRoles.filter(u => 
      u?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const activeEvents = useMemo(() => {
    const safeEvents = Array.isArray(events) ? events : [];
    return safeEvents.filter(e => e.status === "published");
  }, [events]);

  const stats = useMemo<DashboardStats>(() => {
    const safeUsers = Array.isArray(users) ? users : [];

    const pertinentUsers = safeUsers.filter(u => u.role === "VENDOR" || u.role === "PLANNER");
    const activeU = pertinentUsers.filter(u => u.status === "ACTIVE").length;
    const suspendedU = pertinentUsers.filter(u => u.status === "SUSPENDED").length;

    return {
      totalUsers: pertinentUsers.length,
      activeUsers: activeU,
      suspendedUsers: suspendedU,
      activeEvents: activeEvents.length,
    };
  }, [users, activeEvents]);

  const handleQuickAction = (action: string) => {
    toast.success(`${action} initiated (Demo Mode)`);
  };

  const handleSeedData = async () => {
    try {
      toast.loading("Seeding sample data...", { id: "seed" });
      await seedSampleData();
      toast.success("Sample data seeded! Reloading...", { id: "seed" });
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      toast.error("Seeding failed. Check console for details.", { id: "seed" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
             <ShieldCheck size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Admin Central</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <SidebarLink 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")} 
          />
          <SidebarLink 
            icon={<Users size={20} />} 
            label="User Management" 
            active={activeTab === "users"} 
            onClick={() => setActiveTab("users")} 
          />
          <SidebarLink 
            icon={<CalendarDays size={20} />} 
            label="Active Events" 
            active={activeTab === "events"} 
            onClick={() => setActiveTab("events")} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">AD</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">System Admin</p>
                <p className="text-[10px] text-slate-400 truncate">admin@eventzen.com</p>
              </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab.replace("-", " ")}</h2>
            <p className="text-gray-500 text-sm">System management and monitoring</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64 text-sm"
              />
            </div>
          </div>
        </header>

        {activeTab === "overview" && (
          <Overview 
            stats={stats} 
            users={users}
            events={events}
            onAction={handleQuickAction} 
            onSeed={handleSeedData} 
          />
        )}
        {activeTab === "users" && <UserManagement users={filteredUsers} onToggleStatus={handleUserStatus} />}
        {activeTab === "events" && <ActiveEventsList events={activeEvents} users={users} />}
      </main>
    </div>
  );
}

// Sub-components
function Overview({ 
  stats, 
  users, 
  events, 
  onAction, 
  onSeed 
}: { 
  stats: DashboardStats, 
  users: UserRecord[], 
  events: EventRecord[], 
  onAction: (a: string) => void, 
  onSeed: () => void 
}) {
  useEffect(() => {
    (window as unknown as { handleSeed: () => void }).handleSeed = onSeed;
  }, [onSeed]);
  
  const revenueData = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
    const map = new Map<string, number>();
    
    sorted.forEach(e => {
      if (e.status !== 'published') return;
      
      const dateStr = new Date(e.startDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const fee = e.budget?.platformFee || 0;
      
      map.set(dateStr, (map.get(dateStr) || 0) + fee);
    });

    return Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue }));
  }, [events]);

  const defaultRevenueData = revenueData.length > 0 ? revenueData : [
    { date: "Current", revenue: 0 }
  ];

  const demographicsData = useMemo(() => {
    const planners = users.filter(u => u.role === "PLANNER").length;
    const vendors = users.filter(u => u.role === "VENDOR").length;
    const attendees = users.filter(u => u.role === "ATTENDEE").length;
    
    return [
      { name: "Planners", value: planners, color: "#3b82f6" },
      { name: "Vendors", value: vendors, color: "#f97316" },
      { name: "Attendees", value: attendees, color: "#10b981" },
    ].filter(d => d.value > 0);
  }, [users]);
  
  const defaultDemoData = demographicsData.length > 0 ? demographicsData : [
    { name: "No Users Yet", value: 1, color: "#cbd5e1" }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Total Platform Users" value={stats.totalUsers} sub={`${stats.suspendedUsers} suspended`} color="blue" />
        <StatCard label="Active Platform Users" value={stats.activeUsers} sub="Vendors & Planners" color="emerald" />
        <StatCard label="Active Global Events" value={stats.activeEvents} sub="Published events" color="orange" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Platform Revenue Trend</h3>
             </div>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={defaultRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val) => `$${val}`} />
                   <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: unknown) => [`$${Number(value || 0).toLocaleString()}`, 'Platform Fee']}
                   />
                   <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">User Demographics</h3>
             </div>
             <div className="h-64 w-full flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={defaultDemoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {defaultDemoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: unknown) => [String(value), 'Users Registered']}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                 </PieChart>
               </ResponsiveContainer>
             </div>
          </div>

        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-8">
           <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
           <div className="space-y-2 mb-8">
              <ActionButton label="Generate Monthly Report" color="blue" onClick={() => onAction("Monthly Report")} />
              <ActionButton label="Send System Broadcast" color="orange" onClick={() => onAction("Broadcast message")} />
              <ActionButton label="Seed Sample Data" color="emerald" onClick={() => (window as unknown as { handleSeed: () => void }).handleSeed()} />
           </div>

           <div className="pt-6 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Core Microservices</p>
              <div className="space-y-4">
                 <HealthItem label="User Service / Auth" status="Operational" />
                 <HealthItem label="Event Management" status="Operational" />
                 <HealthItem label="Payment Gateway" status="Operational" />
                 <HealthItem label="Global State Router" status="Operational" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ label, color, onClick }: { label: string, color: string, onClick: () => void }) {
  const colors: Record<string, string> = {
    blue: "text-blue-600 hover:bg-blue-50 bg-blue-50/50",
    orange: "text-orange-600 hover:bg-orange-50 bg-orange-50/50",
    emerald: "text-emerald-600 hover:bg-emerald-50 bg-emerald-50/50"
  };
  return (
    <button onClick={onClick} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition ${colors[color] || colors.emerald}`}>
      {label}
    </button>
  );
}

function HealthItem({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
       <span className="text-gray-500 font-medium">{label}</span>
       <span className="text-emerald-600 font-bold flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
          {status}
       </span>
    </div>
  );
}

function UserManagement({ users, onToggleStatus }: { users: UserRecord[], onToggleStatus: (id: string, s: string) => void }) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
          <tr>
            <th className="px-6 py-4 font-bold">User</th>
            <th className="px-6 py-4 font-bold">Role</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 font-bold">Created</th>
            <th className="px-6 py-4 font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map(u => (
            <tr key={u._id} className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">{u.name.charAt(0)}</div>
                <div>
                  <div className="font-bold text-gray-900">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                  u.role === "VENDOR" ? "bg-orange-50 text-orange-700 border border-orange-100" :
                  u.role === "PLANNER" ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-teal-50 text-teal-700 border border-teal-100"
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="px-6 py-4">
                 <span className={`flex items-center gap-1.5 text-sm ${u.status === 'ACTIVE' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                    {u.status}
                 </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                 <button 
                  onClick={() => onToggleStatus(u._id, u.status)}
                  className={`text-xs font-bold px-3 py-1 rounded-lg border transition ${
                    u.status === 'ACTIVE' 
                      ? 'border-rose-200 text-rose-600 hover:bg-rose-50' 
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  }`}
                 >
                    {u.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActiveEventsList({ events, users }: { events: EventRecord[], users: UserRecord[] }) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getUserName = (userId: string) => {
    const u = users.find(u => u._id === userId);
    return u ? u.name : "Unknown Planner";
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
        No active events found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col gap-0">
      <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider px-6 py-4">
        <div className="col-span-4">Event Title</div>
        <div className="col-span-3">Planner</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Budget</div>
        <div className="col-span-1 text-right">Details</div>
      </div>
      
      {events.map((e) => {
        const isExpanded = expandedRows.has(e._id);
        const plannerName = getUserName(e.organizerId);

        return (
          <div key={e._id} className="border-b border-gray-100 last:border-none">
            <div 
              className={`grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors ${isExpanded ? "bg-blue-50/50" : "hover:bg-gray-50"}`}
              onClick={() => toggleRow(e._id)}
            >
              <div className="col-span-4 font-bold text-gray-900">{e.title}</div>
              <div className="col-span-3 text-sm text-gray-700 flex items-center gap-2">
                 <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                   {plannerName.charAt(0)}
                 </div>
                 {plannerName}
              </div>
              <div className="col-span-2 text-sm text-gray-500">{new Date(e.startDateTime).toLocaleDateString()}</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">
                 {e.budget ? `${e.budget.currency} ${e.budget.total.toLocaleString()}` : "N/A"}
              </div>
              <div className="col-span-1 flex justify-end text-gray-400">
                 {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {isExpanded && (
              <div className="px-6 py-6 bg-slate-50 border-t border-gray-100 inner-shadow-sm">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Event Organizer</h4>
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                         <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                           {plannerName.charAt(0)}
                         </div>
                         <div>
                            <div className="font-bold text-gray-900">{plannerName}</div>
                            <div className="text-xs text-gray-500">Planner ID: {e.organizerId.slice(-6)}</div>
                         </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Assigned Vendors</h4>
                      {e.selectedVendors && e.selectedVendors.length > 0 ? (
                        <div className="space-y-3">
                           {e.selectedVendors.map((v, idx) => (
                             <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                               <div>
                                  <div className="font-bold text-gray-900 text-sm">{v.vendorNameSnapshot || "Vendor"}</div>
                                  <div className="text-[11px] text-gray-500">{v.serviceNameSnapshot || v.serviceId.slice(-6)} • {v.category || 'Service'}</div>
                               </div>
                               <div className="font-bold text-emerald-600 text-sm">
                                  +{e.budget?.currency || 'USD'} {v.price.toLocaleString()}
                               </div>
                             </div>
                           ))}
                           {e.budget && (
                            <div className="flex justify-between items-center text-xs font-bold text-gray-400 px-2 pt-2 border-t border-gray-200">
                               <span>Platform Fee (5%)</span>
                               <span className="text-gray-900">+{e.budget.currency} {e.budget.platformFee.toLocaleString()}</span>
                            </div>
                           )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No vendors have been assigned to this event yet.</div>
                      )}
                    </div>

                 </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ label, value, sub, color }: { label: string, value: string | number, sub: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="text-gray-500 text-xs font-bold uppercase mb-2">{label}</div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${colorMap[color] || colorMap.blue}`}>{sub}</div>
    </div>
  );
}
