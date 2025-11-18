'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  MessageCircle,
  Eye,
  RefreshCw,
  Bell,
  BellOff
} from 'lucide-react';

interface Order {
  id: string;
  packageName: string;
  platform: string;
  targetUsername: string;
  quantity: number;
  price: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  notes?: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    orders: number;
  };
}

interface Package {
  id: string;
  name: string;
  platform: string;
  quantity: number;
  price: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  minQuantity: number;
  maxQuantity: number;
  basePrice: number;
  isActive: boolean;
  providerName?: string;
  serviceId?: string;
  apiKey?: string;
  apiEndpoint?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: '',
    platform: '',
    quantity: 0,
    price: 0,
    description: ''
  });
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: '',
    minQuantity: 0,
    maxQuantity: 0,
    basePrice: 0,
    providerName: '',
    serviceId: '',
    apiKey: '',
    apiEndpoint: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login');
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [ordersRes, usersRes, packagesRes, servicesRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/users'),
        fetch('/api/packages'),
        fetch('/api/admin/services')
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (packagesRes.ok) {
        const packagesData = await packagesRes.json();
        setPackages(packagesData.packages || []);
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData.services || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const updateNotificationSettings = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailNotifications,
          whatsappNotifications,
        }),
      });

      if (response.ok) {
        console.log('Notification settings updated');
      }
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  };

  const addService = async () => {
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService),
      });

      if (response.ok) {
        setShowAddService(false);
        setNewService({
          name: '',
          description: '',
          category: '',
          minQuantity: 0,
          maxQuantity: 0,
          basePrice: 0,
          providerName: '',
          serviceId: '',
          apiKey: '',
          apiEndpoint: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to add service:', error);
    }
  };

  const handleSendToProvider = async (orderId: string) => {
    try {
      const response = await fetch('/api/provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchData();
      } else {
        alert('Gagal mengirim order ke provider: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to send to provider:', error);
      alert('Terjadi kesalahan saat mengirim ke provider');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const addPackage = async () => {
    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPackage),
      });

      if (response.ok) {
        setShowAddPackage(false);
        setNewPackage({ name: '', platform: '', quantity: 0, price: 0, description: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to add package:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'PROCESSING':
        return 'bg-blue-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'FAILED':
        return 'bg-red-500';
      case 'CANCELLED':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Selesai';
      case 'PROCESSING':
        return 'Proses';
      case 'PENDING':
        return 'Menunggu';
      case 'FAILED':
        return 'Gagal';
      case 'CANCELLED':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/6283176771027', '_blank');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-opacity-90 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-red-500">Admin Dashboard</h1>
            </div>
            
            <nav className="flex items-center space-x-4">
              <Button 
                onClick={() => updateNotificationSettings()}
                variant="outline"
                className={`border-gray-600 ${emailNotifications ? 'text-green-500 border-green-500' : 'text-gray-400'} hover:bg-gray-800`}
              >
                {emailNotifications ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
                {emailNotifications ? 'Email ON' : 'Email OFF'}
              </Button>
              <Button 
                onClick={handleWhatsAppContact}
                variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Support
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total User
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-white">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Order
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-white">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Pendapatan
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-white">
                Rp {orders.reduce((total, order) => total + order.price, 0).toLocaleString('id-ID')}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Paket
              </CardTitle>
              <Settings className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-white">{packages.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="orders" className="text-gray-300">Orders</TabsTrigger>
            <TabsTrigger value="users" className="text-gray-300">Users</TabsTrigger>
            <TabsTrigger value="packages" className="text-gray-300">Packages</TabsTrigger>
            <TabsTrigger value="services" className="text-gray-300">Services</TabsTrigger>
            <TabsTrigger value="logs" className="text-gray-300">Order Logs</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Semua Orders</CardTitle>
                <CardDescription className="text-gray-400">
                  Kelola semua order followers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400">ID Order</th>
                        <th className="text-left py-3 px-4 text-gray-400">User</th>
                        <th className="text-left py-3 px-4 text-gray-400">Paket</th>
                        <th className="text-left py-3 px-4 text-gray-400">Target</th>
                        <th className="text-left py-3 px-4 text-gray-400">Harga</th>
                        <th className="text-left py-3 px-4 text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4">
                            <span className="text-blue-400 font-mono text-sm">
                              #{order.id.slice(-8)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white">
                            <div>
                              <div className="font-semibold">{order.user.name || 'No Name'}</div>
                              <div className="text-sm text-gray-400">{order.user.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-white">
                            <div>
                              <div className="font-semibold">{order.packageName}</div>
                              <div className="text-sm text-gray-400">{order.platform}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-white">@{order.targetUsername}</td>
                          <td className="py-3 px-4 text-white">
                            Rp {order.price.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                              {getStatusText(order.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {order.status === 'PENDING' && (
                                <Button
                                  size="sm"
                                  className="bg-blue-500 hover:bg-blue-600"
                                  onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                                >
                                  <Clock className="w-3 h-3 mr-1" />
                                  Proses
                                </Button>
                              )}
                              {order.status === 'PROCESSING' && order.serviceId && (
                                <Button
                                  size="sm"
                                  className="bg-orange-500 hover:bg-orange-600"
                                  onClick={() => handleSendToProvider(order.id)}
                                >
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Kirim ke Provider
                                </Button>
                              )}
                              {order.status === 'PROCESSING' && (
                                <Button
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600"
                                  onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Selesai
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Semua Users</CardTitle>
                <CardDescription className="text-gray-400">
                  Daftar semua user yang terdaftar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400">User</th>
                        <th className="text-left py-3 px-4 text-gray-400">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400">Role</th>
                        <th className="text-left py-3 px-4 text-gray-400">Total Order</th>
                        <th className="text-left py-3 px-4 text-gray-400">Tanggal Daftar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4 text-white font-semibold">
                            {user.name || 'No Name'}
                          </td>
                          <td className="py-3 px-4 text-white">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge className={user.role === 'ADMIN' ? 'bg-red-500' : 'bg-blue-500'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-white">{user._count.orders}</td>
                          <td className="py-3 px-4 text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Paket Followers</CardTitle>
                    <CardDescription className="text-gray-400">
                      Kelola paket followers yang tersedia
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowAddPackage(true)}
                    className="btn-3d bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Paket
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddPackage && (
                  <Card className="bg-gray-800 border-gray-700 mb-6">
                    <CardHeader>
                      <CardTitle className="text-white">Tambah Paket Baru</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Nama Paket</Label>
                          <Input
                            value={newPackage.name}
                            onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                            className="bg-gray-900 border-gray-700 text-white"
                            placeholder="Contoh: Starter Pack"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Platform</Label>
                          <Select value={newPackage.platform} onValueChange={(value) => setNewPackage({...newPackage, platform: value})}>
                            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                              <SelectValue placeholder="Pilih platform" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              <SelectItem value="Instagram">Instagram</SelectItem>
                              <SelectItem value="TikTok">TikTok</SelectItem>
                              <SelectItem value="YouTube">YouTube</SelectItem>
                              <SelectItem value="Twitter">Twitter</SelectItem>
                              <SelectItem value="Facebook">Facebook</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-300">Jumlah Followers</Label>
                          <Input
                            type="number"
                            value={newPackage.quantity}
                            onChange={(e) => setNewPackage({...newPackage, quantity: parseInt(e.target.value)})}
                            className="bg-gray-900 border-gray-700 text-white"
                            placeholder="1000"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Harga (Rp)</Label>
                          <Input
                            type="number"
                            value={newPackage.price}
                            onChange={(e) => setNewPackage({...newPackage, price: parseInt(e.target.value)})}
                            className="bg-gray-900 border-gray-700 text-white"
                            placeholder="50000"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">Deskripsi</Label>
                        <Textarea
                          value={newPackage.description}
                          onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                          placeholder="Deskripsi paket..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={addPackage}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Simpan
                        </Button>
                        <Button
                          onClick={() => setShowAddPackage(false)}
                          variant="outline"
                          className="border-gray-600 text-gray-400 hover:bg-gray-800"
                        >
                          Batal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400">Nama Paket</th>
                        <th className="text-left py-3 px-4 text-gray-400">Platform</th>
                        <th className="text-left py-3 px-4 text-gray-400">Jumlah</th>
                        <th className="text-left py-3 px-4 text-gray-400">Harga</th>
                        <th className="text-left py-3 px-4 text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400">Tanggal Dibuat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map((pkg) => (
                        <tr key={pkg.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4 text-white font-semibold">{pkg.name}</td>
                          <td className="py-3 px-4">
                            <Badge className="bg-blue-500 text-white">{pkg.platform}</Badge>
                          </td>
                          <td className="py-3 px-4 text-white">{pkg.quantity.toLocaleString()}</td>
                          <td className="py-3 px-4 text-white">
                            Rp {pkg.price.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={pkg.isActive ? 'bg-green-500' : 'bg-red-500'}>
                              {pkg.isActive ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {new Date(pkg.createdAt).toLocaleDateString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Manajemen Layanan</CardTitle>
                    <CardDescription className="text-gray-400">
                      Kelola layanan dan konfigurasi provider API
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowAddService(true)}
                    className="btn-3d bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Layanan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddService && (
                  <Card className="bg-gray-800 border-gray-700 mb-6">
                    <CardHeader>
                      <CardTitle className="text-white">Tambah Layanan Baru</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Nama Layanan</Label>
                          <Input
                            value={newService.name}
                            onChange={(e) => setNewService({...newService, name: e.target.value})}
                            className="bg-gray-900 border-gray-700 text-white"
                            placeholder="Contoh: Instagram Followers"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Kategori</Label>
                          <Select value={newService.category} onValueChange={(value) => setNewService({...newService, category: value})}>
                            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              <SelectItem value="followers">Followers</SelectItem>
                              <SelectItem value="likes">Likes</SelectItem>
                              <SelectItem value="views">Views</SelectItem>
                              <SelectItem value="comments">Comments</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-300">Min Quantity</Label>
                          <Input
                            type="number"
                            value={newService.minQuantity}
                            onChange={(e) => setNewService({...newService, minQuantity: parseInt(e.target.value)})}
                            className="bg-gray-900 border-gray-700 text-white"
                            placeholder="100"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Max Quantity</Label>
                          <Input
                            type="number"
                            value={newService.maxQuantity}
                            onChange={(e) => setNewService({...newService, maxQuantity: parseInt(e.target.value)})}
                            className="bg-gray-900 border-gray-700 text-white"
                            placeholder="100000"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Harga Dasar (Rp)</Label>
                          <Input
                            type="number"
                            value={newService.basePrice}
                            onChange={(e) => setNewService({...newService, basePrice: parseInt(e.target.value)})}
                            className="bg-gray-900 border-gray-700 text-white"
                            placeholder="1000"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Provider Name</Label>
                          <Input
                            value={newService.providerName}
                            onChange={(e) => setNewService({...newService, providerName: e.target.value})}
                            className="bg-gray-900 border-gray-700 text-white"
                            placeholder="Contoh: ProviderAPI"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">Service ID</Label>
                        <Input
                          value={newService.serviceId}
                          onChange={(e) => setNewService({...newService, serviceId: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                          placeholder="service_123"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">API Key</Label>
                        <Input
                          value={newService.apiKey}
                          onChange={(e) => setNewService({...newService, apiKey: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                          placeholder="your-api-key"
                          type="password"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">API Endpoint</Label>
                        <Input
                          value={newService.apiEndpoint}
                          onChange={(e) => setNewService({...newService, apiEndpoint: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                          placeholder="https://api.provider.com/v1/order"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Deskripsi</Label>
                        <Textarea
                          value={newService.description}
                          onChange={(e) => setNewService({...newService, description: e.target.value})}
                          className="bg-gray-900 border-gray-700 text-white"
                          placeholder="Deskripsi layanan..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={addService}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Simpan
                        </Button>
                        <Button
                          onClick={() => setShowAddService(false)}
                          variant="outline"
                          className="border-gray-600 text-gray-400 hover:bg-gray-800"
                        >
                          Batal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400">Layanan</th>
                        <th className="text-left py-3 px-4 text-gray-400">Kategori</th>
                        <th className="text-left py-3 px-4 text-gray-400">Min/Max</th>
                        <th className="text-left py-3 px-4 text-gray-400">Harga Dasar</th>
                        <th className="text-left py-3 px-4 text-gray-400">Provider</th>
                        <th className="text-left py-3 px-4 text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400">Tanggal Dibuat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4 text-white font-semibold">{service.name}</td>
                          <td className="py-3 px-4">
                            <Badge className="bg-blue-500 text-white">{service.category}</Badge>
                          </td>
                          <td className="py-3 px-4 text-white">
                            {service.minQuantity.toLocaleString()} - {service.maxQuantity.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-white">
                            Rp {service.basePrice.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-white">
                            <div className="text-sm">
                              <div className="font-semibold">{service.providerName || 'Manual'}</div>
                              {service.serviceId && (
                                <div className="text-gray-400 text-xs">ID: {service.serviceId}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={service.isActive ? 'bg-green-500' : 'bg-red-500'}>
                              {service.isActive ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {new Date(service.createdAt).toLocaleDateString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order Logs Tab */}
          <TabsContent value="logs">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Order Logs</CardTitle>
                <CardDescription className="text-gray-400">
                  Log semua order dan response dari provider API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="text-white font-semibold">📊 Total Orders</h4>
                      <p className="text-2xl text-blue-500">{orders.length}</p>
                    </div>
                    <Button
                      onClick={() => window.open('/api/admin/orders/export', '_blank')}
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:bg-gray-800"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 text-gray-400">Waktu</th>
                          <th className="text-left py-3 px-4 text-gray-400">Order ID</th>
                          <th className="text-left py-3 px-4 text-gray-400">User</th>
                          <th className="text-left py-3 px-4 text-gray-400">Paket</th>
                          <th className="text-left py-3 px-4 text-gray-400">Target</th>
                          <th className="text-left py-3 px-4 text-gray-400">Status</th>
                          <th className="text-left py-3 px-4 text-gray-400">Provider</th>
                          <th className="text-left py-3 px-4 text-gray-400">Response</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 10).map((order) => (
                          <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="py-3 px-4 text-gray-400 text-sm">
                              {new Date(order.createdAt).toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-blue-400 font-mono text-sm">
                                #{order.id.slice(-8)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-white">
                              <div className="text-sm">
                                <div className="font-semibold">{order.user.name || 'No Name'}</div>
                                <div className="text-gray-400 text-xs">{order.user.email}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-white">{order.packageName}</td>
                            <td className="py-3 px-4 text-white">@{order.targetUsername}</td>
                            <td className="py-3 px-4">
                              <Badge className={`${getStatusColor(order.status)} text-white`}>
                                {getStatusText(order.status)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-white">
                              <div className="text-sm">
                                <div className="text-gray-400">ID: {order.serviceId || 'Manual'}</div>
                                {order.resellerOrderId && (
                                  <div className="text-gray-400">Reseller ID: {order.resellerOrderId}</div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-white">
                              <div className="text-sm max-w-xs truncate">
                                {order.resellerApiUrl ? (
                                  <div className="text-green-400">✓ Sent</div>
                                ) : (
                                  <div className="text-red-400">✗ Not Sent</div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {orders.length > 10 && (
                    <div className="text-center mt-4">
                      <Button
                        onClick={() => setShowAllLogs(true)}
                        variant="outline"
                        className="border-gray-600 text-gray-400 hover:bg-gray-800"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Semua Logs
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}