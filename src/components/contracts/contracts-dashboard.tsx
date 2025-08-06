import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, AlertTriangle, DollarSign, Plus, Search } from "lucide-react";

const ContractsDashboard = () => {
  const stats = {
    totalContracts: 34,
    activeContracts: 28,
    expiringSoon: 5,
    totalValue: 125000000
  };

  const expiringContracts = [
    { id: "1", title: "Contrat de maintenance informatique", client: "BANQUE CENTRALE", endDate: "2024-02-15", value: 12000000, type: "service" },
    { id: "2", title: "Contrat de fourniture bureautique", client: "MINISTÈRE SANTÉ", endDate: "2024-02-28", value: 8500000, type: "sales" },
    { id: "3", title: "Contrat de location véhicules", client: "SOCIÉTÉ TRANSPORT", endDate: "2024-03-10", value: 15000000, type: "rental" }
  ];

  const recentContracts = [
    { id: "1", title: "Système de gestion RH", client: "UNIVERSITÉ MARIEN", status: "active", value: 25000000, startDate: "2024-01-01" },
    { id: "2", title: "Formation informatique", client: "CABINET CONSEIL", status: "draft", value: 3500000, startDate: "2024-01-15" },
    { id: "3", title: "Équipement réseau", client: "HÔPITAL CENTRAL", status: "active", value: 18000000, startDate: "2024-01-10" }
  ];

  const contractsByType = [
    { type: "Vente", count: 12, value: 45000000, percentage: 36 },
    { type: "Service", count: 8, value: 35000000, percentage: 28 },
    { type: "Location", count: 6, value: 25000000, percentage: 20 },
    { type: "Partenariat", count: 4, value: 15000000, percentage: 12 },
    { type: "Achat", count: 4, value: 5000000, percentage: 4 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Contrats</h1>
          <p className="text-muted-foreground">Suivi et gestion des contrats commerciaux</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contrat
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContracts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeContracts} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiration Proche</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">
              Dans les 60 jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalValue / 1000000).toFixed(0)}M</div>
            <p className="text-xs text-muted-foreground">
              FCFA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">
              Renouvellements urgents
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expiring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expiring">Expirations</TabsTrigger>
          <TabsTrigger value="recent">Récents</TabsTrigger>
          <TabsTrigger value="types">Par Type</TabsTrigger>
        </TabsList>

        <TabsContent value="expiring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contrats expirant bientôt</CardTitle>
              <CardDescription>Contrats nécessitant un renouvellement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiringContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{contract.title}</p>
                      <p className="text-sm text-muted-foreground">{contract.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(contract.value / 1000000).toFixed(1)}M FCFA</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">
                          Expire le {contract.endDate}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contrats récents</CardTitle>
              <CardDescription>Derniers contrats créés ou modifiés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{contract.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {contract.client} - Début: {contract.startDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(contract.value / 1000000).toFixed(1)}M FCFA</p>
                      <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                        {contract.status === "active" ? "Actif" : "Brouillon"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par type</CardTitle>
              <CardDescription>Distribution des contrats par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contractsByType.map((cat) => (
                  <div key={cat.type} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{cat.type}</span>
                      <span>{cat.count} contrats - {(cat.value / 1000000).toFixed(1)}M FCFA ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
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

export default ContractsDashboard;