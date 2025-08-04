import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Files, 
  HardDrive, 
  Share2, 
  Activity,
  TrendingUp,
  Users,
  Download,
  Eye
} from 'lucide-react';

interface StatsData {
  totalFiles: number;
  totalSize: number;
  totalShares: number;
  recentUploads: number;
}

const DashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    totalFiles: 0,
    totalSize: 0,
    totalShares: 0,
    recentUploads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Get total files and size
      const { data: files } = await supabase
        .from('uploaded_files')
        .select('file_size, uploaded_at')
        .eq('user_id', user?.id);

      // Get total shares
      const { data: shares } = await supabase
        .from('shared_links')
        .select('id')
        .eq('user_id', user?.id);

      // Calculate recent uploads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentFiles = files?.filter(file => 
        new Date(file.uploaded_at) > sevenDaysAgo
      ) || [];

      const totalSize = files?.reduce((sum, file) => sum + file.file_size, 0) || 0;

      setStats({
        totalFiles: files?.length || 0,
        totalSize,
        totalShares: shares?.length || 0,
        recentUploads: recentFiles.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const statCards = [
    {
      title: "Total Files",
      value: stats.totalFiles,
      icon: Files,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
      description: "Files uploaded",
      trend: "+12%"
    },
    {
      title: "Storage Used",
      value: formatBytes(stats.totalSize),
      icon: HardDrive,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/10",
      description: "of total space",
      trend: "+8%",
      isCustomValue: true
    },
    {
      title: "Shared Links",
      value: stats.totalShares,
      icon: Share2,
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-500/10 to-pink-600/10",
      description: "Active shares",
      trend: "+24%"
    },
    {
      title: "Recent Activity",
      value: stats.recentUploads,
      icon: Activity,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/10 to-green-600/10",
      description: "Last 7 days",
      trend: "+45%"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={itemVariants}
          whileHover={{ 
            y: -5,
            transition: { duration: 0.2 }
          }}
        >
          <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-md`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {stat.isCustomValue ? (
                    stat.value
                  ) : (
                    <CountUp
                      end={typeof stat.value === 'number' ? stat.value : 0}
                      duration={2}
                      delay={index * 0.2}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{stat.description}</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{stat.trend}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            
            {/* Decorative gradient overlay */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.gradient} opacity-5 rounded-full translate-x-16 -translate-y-16`}></div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardStats;