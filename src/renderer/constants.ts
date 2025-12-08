const createIsoDate = (year: number, month: number, day: number): string => {
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
};

type TCreateTasksOptions = {
  projectId: string;
  userId: string;
  count: number;
  namePrefix: string;
  baseUrl: string;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
};

const createTasks = ({
  projectId,
  userId,
  count,
  namePrefix,
  baseUrl,
  startDate,
}: TCreateTasksOptions): TProjectTask[] => {
  const { year, month, day } = startDate;

  return Array.from({ length: count }, (_, index) => {
    const created = new Date(Date.UTC(year, month - 1, day + index));
    const updated = new Date(Date.UTC(year, month - 1, day + index + 2));
    const id = `${projectId}-prompt-${index + 1}`;

    return {
      id,
      name: `${namePrefix} Prompt ${index + 1}`,
      created: created.toISOString(),
      updated: updated.toISOString(),
      userId,
      projectId,
      url: `${baseUrl}/prompt-${index + 1}`,
      fileId: `${id}-file`,
    };
  });
};

const PROJECTS_SOURCE = [
  {
    id: "project-customer-support",
    name: "Customer Support Agent",
    created: createIsoDate(2024, 1, 15),
    updated: createIsoDate(2024, 1, 20),
    userId: "user-001",
    tasks: createTasks({
      projectId: "project-customer-support",
      userId: "user-001",
      count: 12,
      namePrefix: "Customer Support",
      baseUrl: "https://example.com/customer-support",
      startDate: { year: 2024, month: 1, day: 3 },
    }),
  },
  {
    id: "project-sales-assistant",
    name: "Sales Assistant Bot",
    created: createIsoDate(2024, 1, 10),
    updated: createIsoDate(2024, 1, 18),
    userId: "user-002",
    tasks: createTasks({
      projectId: "project-sales-assistant",
      userId: "user-002",
      count: 8,
      namePrefix: "Sales",
      baseUrl: "https://example.com/sales-assistant",
      startDate: { year: 2023, month: 12, day: 25 },
    }),
  },
  {
    id: "project-content-generator",
    name: "Content Generator",
    created: createIsoDate(2024, 1, 5),
    updated: createIsoDate(2024, 1, 22),
    userId: "user-003",
    tasks: createTasks({
      projectId: "project-content-generator",
      userId: "user-003",
      count: 15,
      namePrefix: "Content",
      baseUrl: "https://example.com/content-generator",
      startDate: { year: 2023, month: 12, day: 10 },
    }),
  },
  {
    id: "project-technical-docs",
    name: "Technical Documentation",
    created: createIsoDate(2023, 12, 28),
    updated: createIsoDate(2024, 1, 12),
    userId: "user-004",
    tasks: createTasks({
      projectId: "project-technical-docs",
      userId: "user-004",
      count: 6,
      namePrefix: "Documentation",
      baseUrl: "https://example.com/technical-documentation",
      startDate: { year: 2023, month: 12, day: 20 },
    }),
  },
  {
    id: "project-email-responder",
    name: "Email Responder",
    created: createIsoDate(2023, 12, 20),
    updated: createIsoDate(2024, 1, 8),
    userId: "user-005",
    tasks: createTasks({
      projectId: "project-email-responder",
      userId: "user-005",
      count: 10,
      namePrefix: "Email",
      baseUrl: "https://example.com/email-responder",
      startDate: { year: 2023, month: 11, day: 30 },
    }),
  },
] satisfies readonly TProject[];

const cloneProject = (project: TProject): TProject => ({
  ...project,
  tasks: project.tasks.map((task) => ({ ...task })),
});

export const cloneProjects = (projects: TProject[]): TProject[] => {
  return projects.map((project) => cloneProject(project));
};

export const buildProjectsFixture = (): TProject[] => {
  return PROJECTS_SOURCE.map((project) => cloneProject(project));
};

export const PROJECTS_FIXTURE: TProject[] = buildProjectsFixture();
