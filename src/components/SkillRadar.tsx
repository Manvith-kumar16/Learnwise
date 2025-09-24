import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillData {
  listening: number;
  grasping: number;
  retention: number;
  application: number;
}

interface SkillRadarProps {
  data: SkillData;
  title?: string;
}

export const SkillRadar = ({ data, title = "Learning Diagnostics" }: SkillRadarProps) => {
  const skills = [
    { name: "Listening", value: data.listening, color: "stroke-success" },
    { name: "Grasping", value: data.grasping, color: "stroke-primary" },
    { name: "Retention", value: data.retention, color: "stroke-warning" },
    { name: "Application", value: data.application, color: "stroke-error" }
  ];

  const size = 200;
  const center = size / 2;
  const radius = 60;
  
  // Create polygon points for radar chart
  const angleStep = (2 * Math.PI) / skills.length;
  const maxValue = 100;
  
  const getPoint = (value: number, index: number) => {
    const angle = (index * angleStep) - (Math.PI / 2); // Start from top
    const r = (value / maxValue) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  };

  const dataPoints = skills.map((skill, index) => getPoint(skill.value, index)).join(' ');
  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <Card className="card-elevated border-0">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative">
          <svg width={size} height={size} className="overflow-visible">
            {/* Grid circles */}
            {gridLevels.map((level, index) => (
              <circle
                key={level}
                cx={center}
                cy={center}
                r={(level / maxValue) * radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted/20"
                opacity={0.3}
              />
            ))}
            
            {/* Grid lines */}
            {skills.map((_, index) => {
              const angle = (index * angleStep) - (Math.PI / 2);
              const x = center + radius * Math.cos(angle);
              const y = center + radius * Math.sin(angle);
              return (
                <line
                  key={index}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-muted/20"
                  opacity={0.3}
                />
              );
            })}
            
            {/* Data area */}
            <polygon
              points={dataPoints}
              fill="hsl(var(--primary))"
              fillOpacity="0.1"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              className="animate-scale-in"
            />
            
            {/* Data points */}
            {skills.map((skill, index) => {
              const angle = (index * angleStep) - (Math.PI / 2);
              const r = (skill.value / maxValue) * radius;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              
              return (
                <circle
                  key={skill.name}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                  className="animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              );
            })}
            
            {/* Labels */}
            {skills.map((skill, index) => {
              const angle = (index * angleStep) - (Math.PI / 2);
              const labelRadius = radius + 25;
              const x = center + labelRadius * Math.cos(angle);
              const y = center + labelRadius * Math.sin(angle);
              
              return (
                <g key={skill.name}>
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium fill-current"
                  >
                    {skill.name}
                  </text>
                  <text
                    x={x}
                    y={y + 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-current text-muted-foreground"
                  >
                    {skill.value}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-3 w-full">
          {skills.map((skill, index) => (
            <div key={skill.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full bg-primary"
                  style={{ 
                    backgroundColor: `hsl(var(--${
                      skill.name === 'Listening' ? 'success' :
                      skill.name === 'Grasping' ? 'primary' :
                      skill.name === 'Retention' ? 'warning' : 'error'
                    }))` 
                  }}
                />
                <span>{skill.name}</span>
              </div>
              <span className="font-semibold">{skill.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};