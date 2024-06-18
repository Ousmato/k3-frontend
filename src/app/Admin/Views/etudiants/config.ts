interface Config {
    columns?: ColumnConfig[];
    // Autres propriétés de configuration
  }
  
  interface ColumnConfig {
    title: string;
    data: string;
    // Autres propriétés spécifiques à la colonne DataTable
  }