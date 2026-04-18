#!/usr/bin/env sh
set -eu

changed_files="$(git diff --name-only --cached -- 'apps/backend/src/**/*.controller.ts' 'apps/backend/src/**/*.service.ts' 'apps/backend/src/main.ts' || true)"
if [ -z "$changed_files" ]; then
  exit 0
fi

staged_content() {
  git show ":$1" 2>/dev/null || cat "$1"
}

missing=0
for file in $changed_files; do
  [ -f "$file" ] || continue
  content="$(staged_content "$file")"

  if echo "$file" | grep -q '\.controller\.ts$'; then
    has_controller="$(printf '%s\n' "$content" | grep -Ec '@Controller\(' || true)"
    has_route="$(printf '%s\n' "$content" | grep -Ec '@(Get|Post|Put|Patch|Delete)\(' || true)"

    if [ "$has_controller" -gt 0 ] && [ "$has_route" -gt 0 ]; then
      if ! printf '%s\n' "$content" | grep -Eq 'ApiTags\('; then
        echo "Endpoint hook: $file is missing @ApiTags for Swagger grouping." >&2
        missing=1
      fi
      if ! printf '%s\n' "$content" | grep -Eq 'Api[A-Za-z]+Response\('; then
        echo "Endpoint hook: $file is missing explicit Swagger response decorators." >&2
        missing=1
      fi
      if printf '%s\n' "$content" | grep -Eq '@(Post|Put|Patch)\('; then
        if ! printf '%s\n' "$content" | grep -Eq '@Body\([^)]*\)[[:space:]]*[A-Za-z0-9_]+:[[:space:]]*[A-Za-z0-9_]+Dto'; then
          echo "Endpoint hook: $file has a mutating route without an obvious DTO @Body parameter." >&2
          missing=1
        fi
      fi
    fi
  fi

  if echo "$file" | grep -q '\.service\.ts$'; then
    if printf '%s\n' "$content" | grep -Eq 'Scenario|Endpoint|Controller|HttpException|BadRequestException|InternalServerErrorException'; then
      if ! printf '%s\n' "$content" | grep -Eq 'JsonLogger|logger\.(log|warn|error)'; then
        echo "Endpoint hook: $file has no structured JsonLogger usage." >&2
        missing=1
      fi
      if ! printf '%s\n' "$content" | grep -Eq 'MetricsService|recordScenario|recordHttpRequest'; then
        echo "Endpoint hook: $file has no MetricsService usage or metric recording call." >&2
        missing=1
      fi
    fi
  fi
done

if git diff --cached --name-only -- 'apps/backend/src/main.ts' | grep -q .; then
  main_content="$(staged_content apps/backend/src/main.ts)"
  if ! printf '%s\n' "$main_content" | grep -Eq 'ValidationPipe'; then
    echo "Endpoint hook: apps/backend/src/main.ts is missing ValidationPipe." >&2
    missing=1
  fi
  if ! printf '%s\n' "$main_content" | grep -Eq 'useGlobalFilters'; then
    echo "Endpoint hook: apps/backend/src/main.ts is missing global exception filter wiring." >&2
    missing=1
  fi
fi

exit "$missing"
