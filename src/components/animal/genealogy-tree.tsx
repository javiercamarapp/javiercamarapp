"use client"

interface GenealogyAnimal {
  id?: string | null
  nombre?: string | null
  numero_arete?: string | null
  raza?: string | null
}

interface GenealogyData {
  animal: GenealogyAnimal
  padre?: GenealogyAnimal | null
  madre?: GenealogyAnimal | null
  abuelo_paterno?: GenealogyAnimal | null
  abuela_paterna?: GenealogyAnimal | null
  abuelo_materno?: GenealogyAnimal | null
  abuela_materna?: GenealogyAnimal | null
}

interface GenealogyTreeProps {
  data: GenealogyData
}

function GenealogyNode({ animal, label }: { animal?: GenealogyAnimal | null; label?: string }) {
  const hasData = animal && (animal.nombre || animal.numero_arete)

  return (
    <div className="flex flex-col items-center">
      {label && (
        <span className="text-[10px] text-muted-foreground mb-0.5">{label}</span>
      )}
      <div
        className={`rounded-lg border px-3 py-2 text-center min-w-[100px] max-w-[140px] ${
          hasData
            ? "bg-card border-border"
            : "bg-muted/50 border-dashed border-muted-foreground/30"
        }`}
      >
        {hasData ? (
          <>
            <p className="text-xs font-semibold truncate">
              {animal.nombre || "S/N"}
            </p>
            {animal.numero_arete && (
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                {animal.numero_arete}
              </p>
            )}
            {animal.raza && (
              <p className="text-[10px] text-muted-foreground truncate">
                {animal.raza}
              </p>
            )}
          </>
        ) : (
          <p className="text-[10px] text-muted-foreground italic">Sin registro</p>
        )}
      </div>
    </div>
  )
}

function VerticalConnector() {
  return <div className="w-px h-4 bg-border mx-auto" />
}

function HorizontalBranch() {
  return (
    <div className="flex items-start justify-center">
      <div className="flex-1 border-t-2 border-border h-0 mt-0" />
      <div className="w-px h-4 bg-border" />
      <div className="flex-1 border-t-2 border-border h-0 mt-0" />
    </div>
  )
}

export function GenealogyTree({ data }: GenealogyTreeProps) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col items-center min-w-[600px] py-4">
        {/* Generation 3: Grandparents */}
        <div className="flex items-end gap-4 justify-center w-full">
          {/* Paternal grandparents */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex gap-2 justify-center">
              <GenealogyNode animal={data.abuelo_paterno} label="Abuelo Pat." />
              <GenealogyNode animal={data.abuela_paterna} label="Abuela Pat." />
            </div>
            <HorizontalBranch />
          </div>

          {/* Maternal grandparents */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex gap-2 justify-center">
              <GenealogyNode animal={data.abuelo_materno} label="Abuelo Mat." />
              <GenealogyNode animal={data.abuela_materna} label="Abuela Mat." />
            </div>
            <HorizontalBranch />
          </div>
        </div>

        {/* Generation 2: Parents */}
        <div className="flex items-start gap-4 justify-center w-full">
          <div className="flex flex-col items-center flex-1">
            <GenealogyNode animal={data.padre} label="Padre" />
          </div>
          <div className="flex flex-col items-center flex-1">
            <GenealogyNode animal={data.madre} label="Madre" />
          </div>
        </div>

        {/* Connector from parents down to animal */}
        <div className="flex items-start justify-center w-full">
          <div className="flex-1" />
          <div className="flex items-start">
            <div className="flex-1 border-t-2 border-border h-0 w-[100px]" />
            <div className="w-px h-4 bg-border" />
            <div className="flex-1 border-t-2 border-border h-0 w-[100px]" />
          </div>
          <div className="flex-1" />
        </div>

        {/* Generation 1: Animal */}
        <div className="flex flex-col items-center">
          <div className="rounded-lg border-2 border-[#1B4332] bg-[#1B4332]/5 px-4 py-3 text-center min-w-[120px]">
            <p className="text-sm font-bold truncate">
              {data.animal.nombre || "S/N"}
            </p>
            {data.animal.numero_arete && (
              <p className="text-xs text-muted-foreground font-mono truncate">
                {data.animal.numero_arete}
              </p>
            )}
            {data.animal.raza && (
              <p className="text-xs text-muted-foreground truncate">
                {data.animal.raza}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
