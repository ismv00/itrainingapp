export interface Exercise {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface MuscleGroup {
  id: string;
  name: string;
  exercises: Exercise[];
}

export const EXERCISE_DATA: MuscleGroup[] = [
  {
    id: 'chest',
    name: 'Peito',
    exercises: [
      { id: 'bp', name: 'Supino Reto (Barra)' },
      { id: 'dbf', name: 'Crossover' },
      { id: 'incl', name: 'Supino Inclinado Halteres' },
    ],
  },
  {
    id: 'back',
    name: 'Costas',
    exercises: [
      { id: 'pul', name: 'Puxada Alta (Barra)' },
      { id: 'rem', name: 'Remada Curvada' },
      { id: 'lowr', name: 'Remada Baixa' },
    ],
  },
];
