#!/bin/bash
# INTEGRATION Directory Cleanup Script
# Purpose: Purge files older than N days based on embedded dates (filenames, Integration Date, created fields)
# Usage: ./scripts/cleanup-integration.sh [--days N] [--dry-run]

set -euo pipefail

# Configuration
INTEGRATION_DIR="INTEGRATION"
DAYS_OLD=30  # Default: 30 days
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_DIR="${INTEGRATION_DIR}/logs"
LOG_FILE="${LOG_DIR}/cleanup-${TIMESTAMP}.log"
DRY_RUN=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            echo -e "${YELLOW}Running in DRY RUN mode - no files will be deleted${NC}"
            shift
            ;;
        --days)
            DAYS_OLD="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--days N] [--dry-run]"
            exit 1
            ;;
    esac
done

# Ensure log directory exists
mkdir -p "${LOG_DIR}"

# Start logging
exec > >(tee -a "${LOG_FILE}")
exec 2>&1

echo "╔═══════════════════════════════════════════════════╗"
echo "║    INTEGRATION Directory Cleanup                  ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "Timestamp: $(date)"
echo "Target Directory: ${INTEGRATION_DIR}"
echo "Age Threshold: ${DAYS_OLD} days"
echo "Dry Run: ${DRY_RUN}"
echo ""

# Function to extract date from filename
extract_date_from_filename() {
    local filename="$1"
    local basename=$(basename "$filename")

    # Try various date patterns in filenames
    # Pattern 1: YYYYMMDD-HHMMSS (e.g., 20260121-090450)
    if [[ $basename =~ ([0-9]{8})-[0-9]{6} ]]; then
        echo "${BASH_REMATCH[1]}"
        return
    fi

    # Pattern 2: YYYY-MM-DDTHH-MM (e.g., 2025-12-26T08-40)
    if [[ $basename =~ ([0-9]{4}-[0-9]{2}-[0-9]{2})T ]]; then
        echo "${BASH_REMATCH[1]}" | tr -d '-'
        return
    fi

    # Pattern 3: YYYY-MM-DDTHH:MM:SSZ (e.g., 2025-12-26T154903Z)
    if [[ $basename =~ ([0-9]{4}-[0-9]{2}-[0-9]{2})T[0-9]{6}Z ]]; then
        echo "${BASH_REMATCH[1]}" | tr -d '-'
        return
    fi

    echo ""
}

# Function to extract date from file content
extract_date_from_content() {
    local file="$1"

    # Skip binary files
    if ! file "$file" | grep -q "text"; then
        echo ""
        return
    fi

    # Try to find Integration Date or created date in content
    local date_line=$(grep -E "(Integration Date|created|Generated):" "$file" 2>/dev/null | head -1 || echo "")

    if [[ -n "$date_line" ]]; then
        # Extract date in YYYY-MM-DD format
        if [[ $date_line =~ ([0-9]{4}-[0-9]{2}-[0-9]{2}) ]]; then
            echo "${BASH_REMATCH[1]}" | tr -d '-'
            return
        fi

        # Extract date in YYYYMMDD format
        if [[ $date_line =~ ([0-9]{8}) ]]; then
            echo "${BASH_REMATCH[1]}"
            return
        fi
    fi

    echo ""
}

# Function to calculate age in days
calculate_age_days() {
    local date_string="$1"  # YYYYMMDD format

    if [[ -z "$date_string" ]]; then
        echo "-1"
        return
    fi

    # Convert YYYYMMDD to seconds since epoch
    local file_date_seconds=$(date -d "${date_string:0:4}-${date_string:4:2}-${date_string:6:2}" +%s 2>/dev/null || echo "0")
    local current_seconds=$(date +%s)

    if [[ $file_date_seconds -eq 0 ]]; then
        echo "-1"
        return
    fi

    # Calculate difference in days
    local diff_seconds=$((current_seconds - file_date_seconds))
    local diff_days=$((diff_seconds / 86400))

    echo "$diff_days"
}

# Scan for all files (excluding .gitkeep)
echo "Scanning INTEGRATION directory for files..."
ALL_FILES=$(find "${INTEGRATION_DIR}" -type f ! -name '.gitkeep' ! -name "cleanup-*.log" 2>/dev/null || true)

if [[ -z "${ALL_FILES}" ]]; then
    echo -e "${GREEN}✅ No files found in INTEGRATION directory.${NC}"
    exit 0
fi

# Analyze each file and collect old ones
declare -a FILES_TO_DELETE
declare -a FILE_AGES
declare -a FILE_DATES

while IFS= read -r file; do
    # Try to get date from filename first
    file_date=$(extract_date_from_filename "$file")

    # If not found in filename, try content
    if [[ -z "$file_date" ]]; then
        file_date=$(extract_date_from_content "$file")
    fi

    # Calculate age
    age_days=$(calculate_age_days "$file_date")

    # Check if file is old enough
    if [[ $age_days -ge $DAYS_OLD ]]; then
        FILES_TO_DELETE+=("$file")
        FILE_AGES+=("$age_days")
        FILE_DATES+=("$file_date")
    fi
done <<< "${ALL_FILES}"

# Check if any files to delete
if [[ ${#FILES_TO_DELETE[@]} -eq 0 ]]; then
    echo -e "${GREEN}✅ No files older than ${DAYS_OLD} days found.${NC}"
    echo ""
    echo "Current INTEGRATION directory status:"
    du -sh "${INTEGRATION_DIR}"/* 2>/dev/null || echo "Directory is empty"
    exit 0
fi

# Display files to be deleted
FILE_COUNT=${#FILES_TO_DELETE[@]}
echo -e "${YELLOW}Found ${FILE_COUNT} files older than ${DAYS_OLD} days${NC}"
echo ""
echo "Files to be deleted:"
echo "───────────────────────────────────────────────────"

for i in "${!FILES_TO_DELETE[@]}"; do
    file="${FILES_TO_DELETE[$i]}"
    age="${FILE_AGES[$i]}"
    date="${FILE_DATES[$i]}"
    size=$(du -h "$file" | cut -f1)

    # Format date for display
    if [[ -n "$date" && ${#date} -eq 8 ]]; then
        display_date="${date:0:4}-${date:4:2}-${date:6:2}"
    else
        display_date="unknown"
    fi

    echo "  📄 ${file}"
    echo "     Date: ${display_date} | Age: ${age} days | Size: ${size}"
done
echo "───────────────────────────────────────────────────"
echo ""

# Calculate total size
TOTAL_SIZE=$(printf '%s\n' "${FILES_TO_DELETE[@]}" | xargs du -ch 2>/dev/null | tail -1 | cut -f1)
echo "Total size to be freed: ${TOTAL_SIZE}"
echo ""

# Confirm deletion (unless dry-run)
if [[ "${DRY_RUN}" == "true" ]]; then
    echo -e "${YELLOW}DRY RUN: The above files would be deleted.${NC}"
    echo "Run without --dry-run to actually delete files."
    exit 0
fi

# Create backup manifest before deletion
MANIFEST_FILE="${LOG_DIR}/deleted-files-${TIMESTAMP}.txt"
echo "Creating deletion manifest: ${MANIFEST_FILE}"
printf '%s\n' "${FILES_TO_DELETE[@]}" > "${MANIFEST_FILE}"

# Delete files
echo ""
echo "Deleting files..."
DELETED_COUNT=0
FAILED_COUNT=0

for file in "${FILES_TO_DELETE[@]}"; do
    if rm -f "$file" 2>/dev/null; then
        echo -e "${GREEN}✅ Deleted:${NC} ${file}"
        ((DELETED_COUNT++))
    else
        echo -e "${RED}❌ Failed:${NC} ${file}"
        ((FAILED_COUNT++))
    fi
done

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║    Cleanup Summary                                ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "Files scanned: $(echo "${ALL_FILES}" | wc -l)"
echo "Files eligible for deletion: ${FILE_COUNT}"
echo -e "${GREEN}Successfully deleted: ${DELETED_COUNT}${NC}"
if [[ ${FAILED_COUNT} -gt 0 ]]; then
    echo -e "${RED}Failed to delete: ${FAILED_COUNT}${NC}"
fi
echo "Total space freed: ${TOTAL_SIZE}"
echo ""
echo "Manifest saved: ${MANIFEST_FILE}"
echo "Log saved: ${LOG_FILE}"
echo ""

# Clean up empty directories
echo "Cleaning up empty directories..."
EMPTY_DIRS=$(find "${INTEGRATION_DIR}" -type d -empty ! -name "${INTEGRATION_DIR}" 2>/dev/null || true)
if [[ -n "${EMPTY_DIRS}" ]]; then
    EMPTY_COUNT=$(echo "${EMPTY_DIRS}" | wc -l)
    echo "Found ${EMPTY_COUNT} empty directories"
    while IFS= read -r dir; do
        if rmdir "$dir" 2>/dev/null; then
            echo -e "${GREEN}✅ Removed empty directory:${NC} ${dir}"
        fi
    done <<< "${EMPTY_DIRS}"
else
    echo "No empty directories found"
fi

echo ""
echo "Current INTEGRATION directory status:"
du -sh "${INTEGRATION_DIR}"/* 2>/dev/null || echo "Directory is empty"
echo ""
echo -e "${GREEN}✅ Cleanup completed successfully${NC}"
