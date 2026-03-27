import { useState, useMemo, useEffect } from "react";
import { 
  Users, 
  LayoutDashboard, 
  ShieldCheck, 
  Calendar, 
  Search,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { listUsersAdmin, updateUserStatusAdmin } from "../shared/api/userClient";
import { listServicesAdmin, updateServiceStatusAdmin } from "../shared/api/vendorClient";
import { listEventsAdmin } from "../shared/api/eventClient";
import { toast } from "react-hot-toast";

// Types
type Tab = "overview" | "users" | "services" | "events";

type UserRecord = {
  id?: string;
  _id: string;
  name: string;
  email: string;
  role: "ATTENDEE" | "VENDOR" | "PLANNER" | "ADMIN";
  status: string;
  createdAt: string;
};

type ServiceModeration = {
  _id: string;
  vendorName: string;
  serviceName: string;
  category: string;
  price: number;
  isActive: boolean;
  status?: string;
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
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [services, setServices] = useState<ServiceModeration[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, servicesRes, eventsRes] = await Promise.all([
        listUsersAdmin(),
        listServicesAdmin(),
        listEventsAdmin()
      ]);
      
      setUsers(usersRes);
      setServices(servicesRes.data || []);
      setEvents(eventsRes.data || []);
    } catch (error: any) {
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
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      await updateServiceStatusAdmin(serviceId, { isActive });
      setServices(services.map(s => s._id === serviceId ? { ...s, isActive } : s));
      toast.success(`Service ${isActive ? "approved" : "rejected"} successfully`);
    } catch (error) {
      toast.error("Failed to update service status");
    }
  };

  const filteredUsers = useMemo(() => 
    users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, users]);

  const stats = useMemo(() => {
    const revenue = events.reduce((sum, e) => sum + (e.budget?.platformFee || 0), 0);
    const activeU = users.filter(u => u.status === "ACTIVE").length;
    const suspendedU = users.filter(u => u.status === "SUSPENDED").length;

    return {
      totalUsers: users.length,
      activeUsers: activeU,
      suspendedUsers: suspendedU,
      activeEvents: events.filter(e => e.status === "published").length,
      pendingServices: services.filter(s => !s.isActive).length,
      revenue: `Rs. ${revenue.toLocaleString()}`,
    };
  }, [users, events, services]);

  const handleQuickAction = (action: string) => {
    toast.success(`${action} initiated (Demo Mode)`);
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
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0">
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
            icon={<ShieldCheck size={20} />} 
            label="Service Moderation" 
            active={activeTab === "services"} 
            onClick={() => setActiveTab("services")} 
          />
          <SidebarLink 
            icon={<Calendar size={20} />} 
            label="Global Events" 
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

      {/* Main Content */}
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

        {activeTab === "overview" && <Overview stats={stats} onAction={handleQuickAction} />}
        {activeTab === "users" && <UserManagement users={filteredUsers} onToggleStatus={handleUserStatus} />}
        {activeTab === "services" && <ServiceModeration services={services} onToggleService={handleServiceStatus} />}
        {activeTab === "events" && <EventMonitoring events={events} />}
      </main>
    </div>
  );
}

// Sub-components
function Overview({ stats, onAction }: { stats: any, onAction: (a: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Platform Users" value={stats.totalUsers} sub={`${stats.suspendedUsers} suspended`} color="blue" />
        <StatCard label="Active Global Events" value={stats.activeEvents} sub="Published events" color="orange" />
        <StatCard label="Pending Moderation" value={stats.pendingServices} sub="Vendor services" color="violet" />
        <StatCard label="Platform Revenue" value={stats.revenue} sub="Platform fees (5%)" color="emerald" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900">Platform Activity</h3>
              <select className="text-xs border-none bg-gray-50 rounded-lg p-2 outline-none font-semibold text-gray-500">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
              </select>
           </div>
           <div className="flex items-end gap-3 h-48 justify-around pt-4 border-b border-gray-100">
              {[45, 60, 40, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                   <div 
                    style={{ height: `${h}%` }} 
                    className="w-8 bg-blue-100 rounded-t-lg group-hover:bg-blue-500 transition-all duration-300 relative"
                   >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}%
                     </div>
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 capitalize">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
           <div className="space-y-2">
              <ActionButton label="Generate Monthly Report" color="blue" onClick={() => onAction("Monthly Report")} />
              <ActionButton label="Send System Broadcast" color="orange" onClick={() => onAction("Broadcast message")} />
              <ActionButton label="Maintenance Mode" color="rose" onClick={() => onAction("Maintenance toggle")} />
              <div className="pt-4 mt-4 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">System Health</p>
                <div className="space-y-3">
                   <HealthItem label="User Service" status="Operational" />
                   <HealthItem label="Vendor Service" status="Operational" />
                   <HealthItem label="Event Service" status="Operational" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ label, color, onClick }: { label: string, color: string, onClick: () => void }) {
  const colors: any = {
    blue: "text-blue-600 hover:bg-blue-50",
    orange: "text-orange-600 hover:bg-orange-50",
    rose: "text-rose-600 hover:bg-rose-50"
  };
  return (
    <button onClick={onClick} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition ${colors[color]}`}>
      {label}
    </button>
  );
}

function HealthItem({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
       <span className="text-gray-500 font-medium">{label}</span>
       <span className="text-emerald-600 font-bold flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
          {status}
       </span>
    </div>
  );
}

function UserManagement({ users, onToggleStatus }: { users: UserRecord[], onToggleStatus: (id: string, s: string) => void }) {
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

function ServiceModeration({ services, onToggleService }: { services: ServiceModeration[], onToggleService: (id: string, active: boolean) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {services.map(s => (
         <div key={s._id} className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start justify-between shadow-sm">
            <div className="flex gap-4">
               <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="text-slate-400" size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-gray-900">{s.serviceName}</h4>
                  <p className="text-xs text-gray-500 mb-2">by {s.vendorName} • {s.category}</p>
                  <div className="text-xl font-bold text-blue-600">Rs. {s.price.toLocaleString()}</div>
               </div>
            </div>
            
            <div className="flex flex-col items-end gap-3">
               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  s.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
               }`}>
                 {s.isActive ? 'Active' : 'Pending'}
               </span>
               
               <div className="flex gap-2">
                  {s.isActive ? (
                    <button 
                      onClick={() => onToggleService(s._id, false)}
                      className="h-8 w-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center hover:bg-rose-100 transition border border-rose-100"
                    >
                      <XCircle size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => onToggleService(s._id, true)}
                      className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-100 transition border border-emerald-100"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
               </div>
            </div>
         </div>
       ))}
    </div>
  );
}

function EventMonitoring({ events }: { events: EventRecord[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
          <tr>
            <th className="px-6 py-4 font-bold">Event Title</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 font-bold">Start Date</th>
            <th className="px-6 py-4 font-bold">Organizer ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {events.map(e => (
            <tr key={e._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-bold text-gray-900">{e.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                  e.status === "published" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-gray-50 text-gray-700 border border-gray-100"
                }`}>
                  {e.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{new Date(e.startDateTime).toLocaleString()}</td>
              <td className="px-6 py-4 text-xs font-mono text-gray-400">{e.organizerId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helpers
function SidebarLink({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
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

function StatCard({ label, value, sub, color }: { label: string, value: any, sub: string, color: string }) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="text-gray-500 text-xs font-bold uppercase mb-2">{label}</div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${colorMap[color]}`}>{sub}</div>
    </div>
  );
}
