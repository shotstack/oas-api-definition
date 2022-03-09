#!/bin/bash -e
#
# Copy over files from the output of oas-api-definition/build-sdks.sh to the
# SDK directories.

PROG=`basename $0`

OAS_API_DEFINITION_PATH=${1:-./}
SHOTSTACK_SDK_NODE_PATH=${2:-../shotstack-sdk-node}
SHOTSTACK_SDK_PHP_PATH=${3:-../shotstack-sdk-php}
SHOTSTACK_SDK_RUBY_PATH=${4:-../shotstack-sdk-ruby}

NODE_DIRS=(src/api src/model)
PHP_DIRS=(lib/Api lib/Model)
RUBY_DIRS=(lib/shotstack/api lib/shotstack/models)

# Ensure a path exists. If we supply an array in $2, consider them to be
# subdirs, append it to $1 and check it too. Fail if any don't exist.
#
check_path_exists() {
    local BASE="$1"
    shift
    local SUBDIRS=("$@")

    if [ ! -d "${BASE}" ]; then
        >&2 echo "${PROG}: couldn't find ${BASE}; aborting sdk update"
        exit 1
    fi

    for SUBDIR in "${SUBDIRS[@]}"; do
        local DIR="${BASE}"/"${SUBDIR}"
        if [ ! -d $DIR ]; then
            >&2 echo "${PROG}: couldn't find ${DIR}; aborting sdk update"
            exit 1
        fi
    done

    return 0
}

check_repos_exist() {
    check_path_exists $OAS_API_DEFINITION_PATH
    check_path_exists $SHOTSTACK_SDK_NODE_PATH
    check_path_exists $SHOTSTACK_SDK_PHP_PATH
    check_path_exists $SHOTSTACK_SDK_RUBY_PATH
}

update_node_sdk() {
    local FROM_BASE=${OAS_API_DEFINITION_PATH}/build/sdks/node
    local TO_BASE=${SHOTSTACK_SDK_NODE_PATH}

    check_path_exists $FROM_BASE
    check_path_exists $TO_BASE

    rsync -r ${FROM_BASE}/src/ ${TO_BASE}/src
}

update_php_sdk() {
    local FROM_BASE=${OAS_API_DEFINITION_PATH}/build/sdks/php
    local TO_BASE=${SHOTSTACK_SDK_PHP_PATH}

    check_path_exists $FROM_BASE
    check_path_exists $TO_BASE

    rsync -r ${FROM_BASE}/composer.json ${TO_BASE}
    rsync -r ${FROM_BASE}/lib/ ${TO_BASE}/src
}

update_ruby_sdk() {
    local FROM_BASE=${OAS_API_DEFINITION_PATH}/build/sdks/ruby
    local TO_BASE=${SHOTSTACK_SDK_RUBY_PATH}

    check_path_exists $FROM_BASE
    check_path_exists $TO_BASE

    rsync -r ${FROM_BASE}/shotstack.gemspec ${TO_BASE}
    rsync -r ${FROM_BASE}/lib/ ${TO_BASE}/lib
}

finish() {
    echo "${PROG}: Update complete. Check changes with git diff in each SDK."
}

check_repos_exist
update_node_sdk
update_php_sdk
update_ruby_sdk
finish
