import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, DollarSign, UserCheck, UserX, AlertTriangle } from "lucide-react";

const HRDashboard = () => {
  const stats = {
    totalEmployees: 45,
    activeEmployees: 42,
    onLeave: 3,
    pendingLeaveRequests: 5,
    payrollPending: 42,
    overtimeHours: 120
  };

  const recentLeaveRequests = [
    { id: "1", employee: "Marie Dubois", type: "annual", startDate: "2024-01-15", duration: 5, status: "pending" },
    { id: "2", employee: "Jean Martin", type: "sick", startDate: "2024-01-10", duration: 2, status: "approved" },
    { id: "3", employee: "Sophie Chen", type: "maternity", startDate: "2024-02-01", duration: 90, status: "approved" }
  ];

  const upcomingPayroll = [
    { department: "Administration", employees: 8, amount: 2400000 },
    { department: "Commercial", employees: 12, amount: 3600000 },
    { department: "Technique", employees: 15, amount: 4500000 },
    { department: "Finance", employees: 7, amount: 2800000 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ressources Humaines</h1>
          <p className="text-muted-foreground">Gestion du personnel et de la paie</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <UserCheck className="h-4 w-4 mr-2" />
            Nouveau employé
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Planning
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              sur {stats.totalEmployees} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Congé</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onLeave}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingLeaveRequests} demandes en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Supplémentaires</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overtimeHours}h</div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Demandes de congé</TabsTrigger>
          <TabsTrigger value="payroll">Paie du mois</TabsTrigger>
          <TabsTrigger value="attendance">Pointage</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demandes de congé récentes</CardTitle>
              <CardDescription>Demandes nécessitant une validation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeaveRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{request.employee}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.type} - {request.duration} jour(s) à partir du {request.startDate}
                      </p>
                    </div>
                    <Badge variant={request.status === "approved" ? "default" : request.status === "pending" ? "secondary" : "destructive"}>
                      {request.status === "approved" ? "Approuvé" : request.status === "pending" ? "En attente" : "Refusé"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paie du mois en cours</CardTitle>
              <CardDescription>Répartition par département</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPayroll.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{dept.department}</p>
                      <p className="text-sm text-muted-foreground">{dept.employees} employés</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{dept.amount.toLocaleString()} FCFA</p>
                      <Badge variant="outline">En cours</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex justify-between font-medium">
                  <span>Total général</span>
                  <span>{upcomingPayroll.reduce((sum, dept) => sum + dept.amount, 0).toLocaleString()} FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pointage du jour</CardTitle>
              <CardDescription>Présences et absences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <div className="text-center">
                  <Clock className="h-12 w-12 mx-auto mb-2" />
                  <p>Système de pointage en cours de développement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRDashboard;