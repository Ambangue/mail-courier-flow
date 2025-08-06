import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, TrendingDown, TrendingUp, AlertTriangle, Plus, Search } from "lucide-react";

const InventoryDashboard = () => {
  const stats = {
    totalProducts: 245,
    lowStock: 12,
    outOfStock: 3,
    totalValue: 15750000
  };

  const lowStockItems = [
    { id: "1", name: "Papier A4", currentStock: 5, minStock: 20, category: "Fournitures" },
    { id: "2", name: "Cartouches d'encre HP", currentStock: 2, minStock: 10, category: "Informatique" },
    { id: "3", name: "Stylos bleus", currentStock: 8, minStock: 50, category: "Fournitures" }
  ];

  const recentMovements = [
    { id: "1", product: "Ordinateur portable Dell", type: "in", quantity: 5, date: "2024-01-15", reference: "BC-2024-001" },
    { id: "2", product: "Ramettes papier", type: "out", quantity: 10, date: "2024-01-14", reference: "Consommation" },
    { id: "3", product: "Chaises de bureau", type: "in", quantity: 15, date: "2024-01-13", reference: "BC-2024-002" }
  ];

  const topCategories = [
    { category: "Informatique", value: 8500000, percentage: 54 },
    { category: "Mobilier", value: 3200000, percentage: 20 },
    { category: "Fournitures", value: 2100000, percentage: 13 },
    { category: "Équipements", value: 1950000, percentage: 13 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Stocks</h1>
          <p className="text-muted-foreground">Inventaire et mouvements de stock</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
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
            <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Articles en stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">
              À réapprovisionner
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rupture de Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">
              Articles épuisés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              FCFA
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alertes Stock</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Articles en stock faible</CardTitle>
              <CardDescription>Produits nécessitant un réapprovisionnement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-orange-600">
                        {item.currentStock} / {item.minStock}
                      </p>
                      <Badge variant="secondary">Stock faible</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mouvements récents</CardTitle>
              <CardDescription>Dernières entrées et sorties de stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{movement.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {movement.reference} - {movement.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={movement.type === "in" ? "default" : "secondary"}>
                        {movement.type === "in" ? "+" : "-"}{movement.quantity}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {movement.type === "in" ? "Entrée" : "Sortie"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Valeur par catégorie</CardTitle>
              <CardDescription>Répartition de la valeur du stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{cat.category}</span>
                      <span>{(cat.value / 1000000).toFixed(1)}M FCFA ({cat.percentage}%)</span>
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

export default InventoryDashboard;