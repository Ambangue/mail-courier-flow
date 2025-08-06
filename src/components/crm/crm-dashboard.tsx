import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, DollarSign, TrendingUp, Plus, Phone } from "lucide-react";

const CRMDashboard = () => {
  const stats = {
    totalClients: 127,
    activeOpportunities: 23,
    monthlyRevenue: 45000000,
    conversionRate: 32
  };

  const opportunities = [
    { id: "1", client: "SARL CONGO TECH", title: "Système de gestion intégré", value: 15000000, stage: "proposal", probability: 75 },
    { id: "2", client: "ETS MODERN OFFICE", title: "Équipement informatique", value: 8500000, stage: "negotiation", probability: 60 },
    { id: "3", client: "CABINET JURIDIQUE ABC", title: "Logiciel de gestion", value: 3200000, stage: "qualification", probability: 40 }
  ];

  const recentActivities = [
    { id: "1", type: "call", client: "SARL CONGO TECH", description: "Appel de suivi - présentation acceptée", date: "2024-01-15" },
    { id: "2", type: "meeting", client: "ETS MODERN OFFICE", description: "Réunion de négociation", date: "2024-01-14" },
    { id: "3", type: "email", client: "CABINET JURIDIQUE ABC", description: "Envoi de la proposition commerciale", date: "2024-01-13" }
  ];

  const topClients = [
    { client: "BANQUE CENTRALE", revenue: 25000000, projects: 3 },
    { client: "MINISTÈRE DES FINANCES", revenue: 18000000, projects: 2 },
    { client: "GROUPE INDUSTRIEL XYZ", revenue: 12000000, projects: 4 },
    { client: "UNIVERSITÉ DE BRAZZAVILLE", revenue: 8500000, projects: 2 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion Commerciale (CRM)</h1>
          <p className="text-muted-foreground">Clients, opportunités et suivi commercial</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
          <Button variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Opportunité
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Clients actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunités</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              En cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA Mensuel</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.monthlyRevenue / 1000000).toFixed(0)}M</div>
            <p className="text-xs text-muted-foreground">
              FCFA ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Opportunités gagnées
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="clients">Top Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Opportunités en cours</CardTitle>
              <CardDescription>Affaires en développement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunities.map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{opp.title}</p>
                      <p className="text-sm text-muted-foreground">{opp.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(opp.value / 1000000).toFixed(1)}M FCFA</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          opp.stage === "proposal" ? "default" : 
                          opp.stage === "negotiation" ? "secondary" : 
                          "outline"
                        }>
                          {opp.stage === "proposal" ? "Proposition" : 
                           opp.stage === "negotiation" ? "Négociation" : 
                           "Qualification"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{opp.probability}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
              <CardDescription>Dernières interactions avec les clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{activity.client}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                      <Badge variant="outline" className="mt-1">
                        {activity.type === "call" ? "Appel" : 
                         activity.type === "meeting" ? "Réunion" : 
                         "Email"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clients principaux</CardTitle>
              <CardDescription>Top clients par chiffre d'affaires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{client.client}</p>
                      <p className="text-sm text-muted-foreground">{client.projects} projet(s) en cours</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(client.revenue / 1000000).toFixed(1)}M FCFA</p>
                      <Badge variant="default">VIP</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMDashboard;