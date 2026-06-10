export interface Component {
  id: string;
  title: string;
  summary: string;
  purpose: string;
  implementation: string;
  examples: string[];
  evidence: string[];
  references: string[];
}

export interface MaturityLevel {
  level: number;
  title: string;
  components: Component[];
}

export interface Control {
  id: string;
  name: string;
  description: string;
  guidance: string;
  icon: string;
  maturityLevels: MaturityLevel[];
}
