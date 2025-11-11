import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Ban, CheckCircle } from 'lucide-react';

export default function AdminPage() {
  const [flaggedAdapters] = useState([
    {
      id: '1',
      name: 'Suspicious Adapter',
      reason: 'Copyright violation reported',
      reporter: 'user123',
      date: '2024-01-20',
      status: 'pending',
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Admin <span className="gradient-text">Panel</span>
            </h1>
            <p className="text-muted-foreground">
              Moderate content and manage platform integrity
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">
                  {flaggedAdapters.filter(a => a.status === 'pending').length}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">
                  {flaggedAdapters.length}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Actions Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">
                  0
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="glass-panel">
              <TabsTrigger value="reports">Flagged Content</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="logs">Activity Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-4">
              {flaggedAdapters.map(adapter => (
                <Card key={adapter.id} className="glass-panel">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          <h3 className="font-semibold">{adapter.name}</h3>
                          <Badge variant="destructive">{adapter.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Reason: {adapter.reason}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reported by {adapter.reporter} on {adapter.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Ban className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="users">
              <Card className="glass-panel">
                <CardContent className="p-6">
                  <div className="text-muted-foreground text-center py-12">
                    User management interface would go here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card className="glass-panel">
                <CardContent className="p-6">
                  <div className="text-muted-foreground text-center py-12">
                    Activity logs would go here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
