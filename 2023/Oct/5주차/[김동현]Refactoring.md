# 리팩토링

# 리팩토링 실습

- 예제 코드
    
    ```java
    @Test
    public void 초기_로직() {
      // 최종 반환 값을 위한 변수 선언
      int beforeCpu = 0;
      int beforeMemory = 0;
      int beforeDisk = 0;
    
      int afterCpu = 0;
      int afterMemory = 0;
      int afterDisk = 0;
    
      // targetVms 순회하며 status 가 oversized, undersized 인 경우에 metricType 별 로
      // before, after 값의 총합을 구한다.
      for (RightsizingVm vm : rightsizingVms) {
        switch (vm.getStatus()) {
          case "oversized" :
            if ("cpu".equals(vm.getMetricType())) {
              beforeCpu += vm.getBeforeValue();
              afterCpu += vm.getAfterValue();
            }
            if ("memory".equals(vm.getMetricType())) {
              beforeMemory += vm.getBeforeValue();
              afterMemory += vm.getAfterValue();
            }
            if ("disk".equals(vm.getMetricType())) {
              beforeDisk += vm.getBeforeValue();
              afterDisk += vm.getAfterValue();
            }
            break;
          case "undersized" :
            if ("cpu".equals(vm.getMetricType())) {
              beforeCpu += vm.getBeforeValue();
              afterCpu += vm.getAfterValue();
            }
            if ("memory".equals(vm.getMetricType())) {
              beforeMemory += vm.getBeforeValue();
              afterMemory += vm.getAfterValue();
            }
            if ("disk".equals(vm.getMetricType())) {
              beforeDisk += vm.getBeforeValue();
              afterDisk += vm.getAfterValue();
            }
            break;
        }
      }
    
      // 객체 선언
      Effect cpuEffect = new Effect();
      Effect memoryEffect = new Effect();
      Effect diskEffect = new Effect();
    
      // 각 객체에 setter 를 통한 값 할당
      cpuEffect.setBeforeValue(beforeCpu);
      cpuEffect.setAfterValue(afterCpu);
    
      memoryEffect.setBeforeValue(beforeMemory);
      memoryEffect.setAfterValue(afterMemory);
    
      diskEffect.setBeforeValue(beforeDisk);
      diskEffect.setAfterValue(afterDisk);
    
      // 최종 반환 객체에 생성자를 통해 할당
      RightsizingResponse response = new RightsizingResponse(cpuEffect, memoryEffect, diskEffect);
    }
    ```
    

# 가독성

### 깊은 중첩문 정리

- Stream 활용
    - Java Stream을 사용함으로 불필요한 컬렉션/객체/변수 등의 선언을 최소화하여 메모리를 절약할 수 있다.
    - 더 빠른 요소 탐색 성능을 발휘할 수 있다.
    - 함수형 프로그래밍으로 더 간결하고 가독성이 좋은 코드를 짤 수 있다.
- 예제 코드
    
    ```java
    @Test
    public void 깊은_중첩문_스트림_변환() {
      // status 가 oversized, undersized 인 요소를 대상으로 메트릭 타입 별 before, after 총합을 구한 후
      // 각 변수에 즉시 할당한다.
      int beforeCpu = rightsizingVms.stream()
          .filter(vm -> vm.getStatus().equals("oversized") || vm.getStatus().equals("undersized"))
          .filter(vm -> vm.getMetricType().equals("cpu"))
          .mapToInt(RightsizingVm::getBeforeValue)
          .sum();
    
      int beforeMemory = rightsizingVms.stream()
          .filter(vm -> vm.getStatus().equals("oversized") || vm.getStatus().equals("undersized"))
          .filter(vm -> vm.getMetricType().equals("memory"))
          .mapToInt(RightsizingVm::getBeforeValue)
          .sum();
    
      int beforeDisk = rightsizingVms.stream()
          .filter(vm -> vm.getStatus().equals("oversized") || vm.getStatus().equals("undersized"))
          .filter(vm -> vm.getMetricType().equals("disk"))
          .mapToInt(RightsizingVm::getBeforeValue)
          .sum();
    
      int afterCpu = rightsizingVms.stream()
          .filter(vm -> vm.getStatus().equals("oversized") || vm.getStatus().equals("undersized"))
          .filter(vm -> vm.getMetricType().equals("cpu"))
          .mapToInt(RightsizingVm::getAfterValue)
          .sum();
    
      int afterMemory = rightsizingVms.stream()
          .filter(vm -> vm.getStatus().equals("oversized") || vm.getStatus().equals("undersized"))
          .filter(vm -> vm.getMetricType().equals("memory"))
          .mapToInt(RightsizingVm::getAfterValue)
          .sum();
    
      int afterDisk = rightsizingVms.stream()
          .filter(vm -> vm.getStatus().equals("oversized") || vm.getStatus().equals("undersized"))
          .filter(vm -> vm.getMetricType().equals("disk"))
          .mapToInt(RightsizingVm::getAfterValue)
          .sum();
    
      // 객체 선언
      Effect cpuEffect = new Effect();
      Effect memoryEffect = new Effect();
      Effect diskEffect = new Effect();
    
      // 각 객체에 setter 를 통한 값 할당
      cpuEffect.setBeforeValue(beforeCpu);
      cpuEffect.setAfterValue(afterCpu);
    
      memoryEffect.setBeforeValue(beforeMemory);
      memoryEffect.setAfterValue(afterMemory);
    
      diskEffect.setBeforeValue(beforeDisk);
      diskEffect.setAfterValue(afterDisk);
    
      // 최종 반환 객체에 생성자를 통해 할당
      RightsizingResponse response = new RightsizingResponse(cpuEffect, memoryEffect, diskEffect);
    }
    ```
    

### 중복 코드 제거

- 중복 코드 부분을 로직의 상위 부분에서 공통적으로 처리하면 하위 로직을 간결화 할 수 있다.
- 예제 코드
    
    ```java
    @Test
    public void 중복코드제거() {
    
      // status 가 oversized, undersized 인 요소를 대상으로만 자원 총합을 구하기 위해 새로운 List를 생성한다.
      List<RightsizingVm> targetVms = rightsizingVms.stream()
          .filter(vm -> vm.getStatus().equals("oversized") || vm.getStatus().equals("undersized"))
          .collect(Collectors.toList());
    
      // 메트릭 타입 별 before, after 총합을 구한 후
      // 각 변수에 즉시 할당한다.
      int beforeCpu = targetVms.stream()
          .filter(vm -> vm.getMetricType().equals("cpu"))
          .mapToInt(RightsizingVm::getBeforeValue)
          .sum();
    
      int beforeMemory = targetVms.stream()
          .filter(vm -> vm.getMetricType().equals("memory"))
          .mapToInt(RightsizingVm::getBeforeValue)
          .sum();
    
      int beforeDisk = targetVms.stream()
          .filter(vm -> vm.getMetricType().equals("disk"))
          .mapToInt(RightsizingVm::getBeforeValue)
          .sum();
    
      int afterCpu = targetVms.stream()
          .filter(vm -> vm.getMetricType().equals("cpu"))
          .mapToInt(RightsizingVm::getAfterValue)
          .sum();
    
      int afterMemory = targetVms.stream()
          .filter(vm -> vm.getMetricType().equals("memory"))
          .mapToInt(RightsizingVm::getAfterValue)
          .sum();
    
      int afterDisk = targetVms.stream()
          .filter(vm -> vm.getMetricType().equals("disk"))
          .mapToInt(RightsizingVm::getAfterValue)
          .sum();
    
      // 객체 선언
      Effect cpuEffect = new Effect();
      Effect memoryEffect = new Effect();
      Effect diskEffect = new Effect();
    
      // 각 객체에 setter 를 통한 값 할당
      cpuEffect.setBeforeValue(beforeCpu);
      cpuEffect.setAfterValue(afterCpu);
    
      memoryEffect.setBeforeValue(beforeMemory);
      memoryEffect.setAfterValue(afterMemory);
    
      diskEffect.setBeforeValue(beforeDisk);
      diskEffect.setAfterValue(afterDisk);
    
      // 최종 반환 객체에 생성자를 통해 할당
      RightsizingResponse response = new RightsizingResponse(cpuEffect, memoryEffect, diskEffect);
    }
    ```
    

### 메소드 추출 (feat. 재사용성)

- 반복되는 코드를 공통 메서드로 추출하여 가독성 및 코드 재사용성을 향상 시킬 수 있다.
- 단위 변환, 특정 문자열 추출 등 로직마다 사용되는 코드는 Util 성 메서드로 추출하여 코드 직관성 및 재사용성을 향상시킬 수 있다.
- 예제 코드
    
    ```java
    @Test
    public void 메소드_추출() {
      // status 가 oversized, undersized 인 요소를 대상으로만 자원 총합을 구하기 위해 새로운 List를 생성한다.
      List<RightsizingVm> targetVms = rightsizingVms.stream()
          .filter(vm -> vm.getStatus().equals("oversized") || vm.getStatus().equals("undersized"))
          .collect(Collectors.toList());
    
      // 분리된 메소드를 통해 메트릭 타입별 Effect 객체를 생성한 후 할당한다.
      Effect cpuEffect = getEffectByMetricType(targetVms, "cpu");
      Effect memoryEffect = getEffectByMetricType(targetVms, "memory");
      Effect diskEffect = getEffectByMetricType(targetVms, "disk");
    
      // 최종 반환 객체에 생성자를 통해 할당
      RightsizingResponse response = new RightsizingResponse(cpuEffect, memoryEffect, diskEffect);
    }
    
    private Effect getEffectByMetricType(List<RightsizingVm> rightsizingVms, String metricType) {
      // 파라미터로 받은 메트릭 타입에 해당하는 요소만을 대상으로 before 총합을 구한다.
      int beforeMetricSum = rightsizingVms.stream()
          .filter(vm -> vm.getMetricType().equals(metricType))
          .mapToInt(RightsizingVm::getBeforeValue)
          .sum();
    
      // 파라미터로 받은 메트릭 타입에 해당하는 요소만을 대상으로 after 총합을 구한다.
      int afterMetricSum = rightsizingVms.stream()
          .filter(vm -> vm.getMetricType().equals(metricType))
          .mapToInt(RightsizingVm::getAfterValue)
          .sum();
    
      Effect effect = new Effect();
    
      effect.setBeforeValue(beforeMetricSum);
      effect.setAfterValue(afterMetricSum);
    
      return effect;
    }
    ```
    

### 빌더 패턴 적용

- 필요한 데이터만 설정할 수 있음
    - 하지만 오히려 객체의 모든 필드의 값을 할당해야하는 경우엔 빌더패턴으로 인해 누락된 필드가 발생할 수 있어 유의해야 한다
- 유연성을 확보할 수 있음
    - 전체 필드 생성자를 통한 객체 생성은 모든 필드에 대한 값을 작성하지 않으면 컴파일 에러가 발생하기 때문에 빌더 패턴을 통해 작성하면 해당 클래스의 필드가 추가 되더라도 에러가 발생하지 않는다
- 가독성을 높일 수 있음
    - 생성자를 통해 객체를 생성하면 각 파라미터의 위치가 어떤 필드의 값을 할당하는지 해당 클래스를 보지 않는한 힘들다.
    - 하지만 빌더 패턴은 명시적으로 필드에 대한 값을 할당하기 때문에 코드 가독성이 향상된다.
- **불변성**을 확보할 수 있음 (완전한 불변 객체는 아님)
    - 많은 개발자들이 초기값을 가진 객체를 선언한 후 lombok 라이브러리를 통해 setter 메서드를 통해
    선언 후에 객체의 필드 값을 할당한다. 그렇다면 불필요한 확장 가능성을 열어두고 해당 객체의 변경점을 파악하기가 힘들어진다.
    - 하지만 빌더 패턴은 객체 선언과 동시에 필드 값을 할당하기 때문에 해당 객체의 불필요한 코드 확장 및 변경점 파악이 용이해진다.
    - 빌더 패턴은 내부 클래스로 작성되어있어 빌더 패턴으로 객체를 생성할 경우 항상 새로운 객체가 생성되므로 빌더 패턴만을 사용하면 불변성을 확보 할 수 있다.
    - 아래에서 더 자세히 설명
- 예제 코드
    
    ```java
    @Test
    public void 빌더패턴_적용() {
    // status 가 oversized, undersized 인 요소를 대상으로만 자원 총합을 구하기 위해 새로운 List를 생성한다.
    List<RightsizingVm> targetVms = rightsizingVms.stream()
        .filter(vm -> vm.getStatus().equals("oversized") || vm.getStatus().equals("undersized"))
        .collect(Collectors.toList());
    
    // 분리된 메소드를 통해 메트릭 타입별 Effect 객체를 생성한 후 할당한다.
    Effect cpuEffect = getEffectByMetricType(targetVms, "cpu");
    Effect memoryEffect = getEffectByMetricType(targetVms, "memory");
    Effect diskEffect = getEffectByMetricType(targetVms, "disk");
    
    // 최종 반환 객체에 생성자를 통해 할당, 코드 라인은 더 많아지지만 객체 가독성이 더욱 향상되었다.
    RightsizingResponse response = RightsizingResponse.builder()
        .cpu(cpuEffect)
        .memory(memoryEffect)
        .disk(diskEffect)
        .build();
    }
    
    private Effect getEffectByMetricType(List<RightsizingVm> rightsizingVms, String metricType) {
    // 파라미터로 받은 메트릭 타입에 해당하는 요소만을 대상으로 before 총합을 구한다.
    int beforeMetricSum = rightsizingVms.stream()
        .filter(vm -> vm.getMetricType().equals(metricType))
        .mapToInt(RightsizingVm::getBeforeValue)
        .sum();
    
    // 파라미터로 받은 메트릭 타입에 해당하는 요소만을 대상으로 after 총합을 구한다.
    int afterMetricSum = rightsizingVms.stream()
        .filter(vm -> vm.getMetricType().equals(metricType))
        .mapToInt(RightsizingVm::getAfterValue)
        .sum();
    
    // 최종 반환 객체에 생성자를 통해 할당, 코드 라인은 더 많아지지만 객체 가독성이 더욱 향상되었다.
    return Effect.builder()
        .beforeValue(beforeMetricSum)
        .afterValue(afterMetricSum)
        .build();
    }
    ```
    

# 코드 안정성

### Enum 사용

- Enum 타입을 사용함으로써 String 타입 필드이지만 정해진 상수들로만 이루어졌다면 Enum 타입으로 대체하여 코드 가독성 및 안정성을 향상 시킬 수 있다.
- 하지만 Enum 타입을 사용함으로써 반드시 수반되는 로직 구현들이 존재한다.
    - Enum에 존재하는 상수들에 해당하지 않는 값이 요청 되었을 경우에 예외 핸들링 로직
    - 대소문자 구분없이 사용할 수 있도록 별도의 컨버터 핸들러 로직 구현
    - RDB 매핑을 위한 Entity 클래스에 `@Enumerated(EnumType.*STRING*)` 어노테이션 적용
- 예제 코드
    - before
        
        ```java
        public class RightsizingVm {
          private String name;
          private String status;
          private String metricType;
          private int beforeValue;
          private int afterValue;
        }
        ```
        
    - after
        
        ```java
        public class RightsizingVm {
          private String name;
          private Status status;
          private MetricType metricType;
          private int beforeValue;
          private int afterValue;
        }
        
        // Enum
        public enum MetricType {
          cpu, memory, disk
        }
        public enum Status {
          oversized, undersized, inactive
        }
        ```
        
    - 서비스 로직
        
        ```java
        @Test
        public void 열거형_적용() {
          // Enum 타입을 통해 문자열이지만 정해진 상수로 코드 안정성 및 가독성을 향상시킨다.    
          List<RightsizingVm2> targetVms = rightsizingVms.stream()
              .filter(vm -> vm.getStatus().equals(Status.oversized) || vm.getStatus().equals(Status.undersized))
              .collect(Collectors.toList());
        
          Effect cpuEffect = getEffectByMetricType(targetVms, MetricType.cpu);
          Effect memoryEffect = getEffectByMetricType(targetVms, MetricType.memory);
          Effect diskEffect = getEffectByMetricType(targetVms, MetricType.disk);
        
          RightsizingResponse response = RightsizingResponse.builder()
              .cpu(cpuEffect)
              .memory(memoryEffect)
              .disk(diskEffect)
              .build();
        }
        
        private Effect getEffectByMetricType(List<RightsizingVm2> rightsizingVms, MetricType metricType) {
          int beforeMetricSum = rightsizingVms.stream()
              .filter(vm -> vm.getMetricType().equals(metricType))
              .mapToInt(RightsizingVm2::getBeforeValue)
              .sum();
        
          int afterMetricSum = rightsizingVms.stream()
              .filter(vm -> vm.getMetricType().equals(metricType))
              .mapToInt(RightsizingVm2::getAfterValue)
              .sum();
        
          return Effect.builder()
              .beforeValue(beforeMetricSum)
              .afterValue(afterMetricSum)
              .build();
        }
        ```
        

### Null 처리 (with 예외처리)

- 데이터 반환 값에 Null 이 존재할 수 있는 경우에 대한 처리 로직을 적용하지 않으면 예기치 않은 런타임에서 NPE가 발생할 수 있으므로 가급적 Null 처리를 해주는 것이 좋다.
    - 하지만 Null 이 반환되어야 하도록 구현해야 좋은 경우도 간혹 있다!
- 조건문을 통해 명시적으로 Null에 대한 로직을 처리해줄 수 있지만 로직내 존재하는 모든 부분에 조건문을 통한 Null 처리 코드를 적용하면 코드 복잡성을 야기하고 가독성이 떨어진다.
- Java에서는 Optional 과 같은 Null 을 처리할 수 있는 지원 클래스를 통해 Null 처리를 하는 것이 코드 직관성 측면에서 좋은 방법이다.
- 예제 코드
    - before
        
        ```java
        public void providerTest(long providerId) {
        		// findById를 통해 조회해온 값이 Null이라면?
            Provider provider = providerRepository.findById(providerId);
        
            // NPE가 발생한다.
        		providerRepository.delete(provider);
            providerRepository.save(provider);
        }
        ```
        
    - after 1 - 조건문을 사용한 명시적 null 처리
        
        ```java
        public void providerTest(long providerId) {
            Provider provider = providerRepository.findById(providerId);
        
            // null 값이 아니면
        		if (provider != null) {
        				providerRepository.delete(provider);
        		    providerRepository.save(provider);
        		}
        }
        ```
        
        - 조건문을 통해 명시적인 null 처리로 해결이 가능하지만
        - 많은 로직에 전부 조건문을 통해 처리한다면?
            - 코드 복잡성이 증가하고 보기가 더러워진다..
        - 또한 provider 객체에는 이미 null 값이 할당이 되어 있는 상태이기 때문에 완전한 null 처리가 불가하다.
        - 해당 메서드 실행시 삭제, 생성 로직이 실행되지 않았을 때 개발자가 즉각적인 디버깅이 힘들다.
    - after 2 - Optional을 사용한 명시적 처리
        
        ```java
        public void providerTest(long providerId) {
            // null 값일 시 빈 값을 반환한다.
            Optional<Provider> provider = providerRepository.findById(providerId);
        
            // Optional 객체의 값이 존재하면
        		if (provider.isPresent()) {
        				providerRepository.delete(provider);
        		    providerRepository.save(provider);
        		}
        }
        ```
        
        - provider 객체에 null 값 할당자체가 될 경우가 없고 null이 라면 Optional 래핑을 통해 빈값이 할당된다.
        - 하지만 여전히 조건문을 통해 로직 처리가 진행되고있다.
        - 조건문을 작성하지 않아도 동작하는데 이상은 없지만 빈객체를 삭제하고 지우는 메서드가 실행되는 것 자체가 비효율이다.
        - 여전히 해당 메서드 실행시 삭제, 생성 로직이 실행되지 않았을 때 개발자가 즉각적인 디버깅이 힘들다.
    - after 3 - Optinoal 리팩토링
        
        ```java
        public void providerTest(long providerId) {
            // 데이터를 조회하지 못하였을 경우 예외를 발생시켜 디버깅이 편리해진다.
            Optional<Provider> provider = Optional.ofNullable(
        						providerRepository.findById(providerId)
        								.orElseThrow(() -> new NoSuchElementException("해당 공급자가 존재하지 않습니다."));
        
            // provider 객체의 값이 존재하지 않을 경우 런타임에서 예외가 발생하므로
            // 값이 존재할 때 해당 로직이 실행되어 조건문을 따로 작성하지 않아도 된다.
        		providerRepository.delete(provider);
            providerRepository.save(provider);
        }
        ```
        
        - findById() 메서드를 통해 데이터를 조회하였을 때 값이 없을 경우 예외가 발생하여 디버깅이 쉬워진다.
        - 또한 예외가 발생하는 경우가 아니라면 반드시 값이 존재하기 때문에 null 처리에 대한 조건문을 작성하지 않아도 된다! (상위 수준에서의 null 처리 및 예외 처리)

### 불변 객체 사용

- 다른 사람이 작성한 함수를 예측가능하며 안전하게 사용할 수 있다.
    - 일반적으로 사용되는 setter 메서드를 통해 객체를 수정할 경우 언제 어디서든 해당 객체의 값을 수정 할 수 있고 그러한 경우에 개발자가 해당 객체의 변경 흐름을 캐치하기가 어려워지고 사이드 이펙트를 발생시킬 가능성이 높아진다.
        - 실제 코드 예시
            
            ```java
            public AnomalyHostMapVo retrieveHypervisors(AnomalyDto anomalyDto) {
                    AnomalyHostMapVo responseVo = new AnomalyHostMapVo();
                    responseVo.setResourceMap(new ArrayList<>());
                    responseVo.setGroup(anomalyDto.getGroup());
            
                    // hypervisor 조회
                    List<HypervisorEntity> metaHostList = openstackService.getHypervisors(anomalyDto.getProviderId());
            
                    // es에 terms 쿼리로 조사할 key 생성
                    List<String> metaHostNameList = new ArrayList<>();
            
                    for (HypervisorEntity metaHost : metaHostList) {
                        AnomalyHostMapVo.ResourceMap resourceMap = new AnomalyHostMapVo.ResourceMap();
                        resourceMap.setName(metaHost.getHypervisorHostName());
                        resourceMap.setState(metaHost.getHypervisorState());
                        resourceMap.setStatus(metaHost.getHypervisorStatus());
                        resourceMap.setVcpu(Integer.toString(metaHost.getVirtualCpu()));
                        resourceMap.setMemory(Integer.toString(metaHost.getMemory()));
                        resourceMap.setDisk(Integer.toString(metaHost.getDisk()));
                        resourceMap.setIsBeatsOn(true);
            
                        responseVo.getResourceMap().add(resourceMap);
                        metaHostNameList.add(metaHost.getHypervisorHostName());
                    }
            
                    SearchResponse searchResponse = anomalyElasic.selectAnomalyScore(metaHostNameList, anomalyDto.getMetricType(), anomalyDto.getDateType(), anomalyDto.getDateUnit());
            
                    Terms terms = searchResponse.getAggregations().get("product");
                    Collection<Terms.Bucket> buckets = (Collection<Terms.Bucket>) terms.getBuckets();
                    // host map 이상점수 세팅
                    Map<String, Object> anomalyMap = new HashMap<>();
                    for (Terms.Bucket bucket : buckets) {
                        List<Aggregation> aggregationList = bucket.getAggregations().asList();
                        if (aggregationList.size() > 0) {
                            ParsedAvg avg = (ParsedAvg) aggregationList.get(0);
                            anomalyMap.put(bucket.getKeyAsString(), avg.getValue() * 100.0);
                        }
                    }
            
                    responseVo.getResourceMap().forEach(item -> {
                        if (null != anomalyMap.get(item.getName())) {
                            item.setAnomalyScore((long) Double.parseDouble(anomalyMap.get(item.getName()).toString()));
                        } else {
                            item.setAnomalyScore(null);
                        }
                    });
            
                    return responseVo;
                }
            ```
            
            - 위 코드에서 resourceMap 객체에 대한 set 메서드가 로직 내부 많은 곳에서 사용되고 있어 해당 로직 내에서 resourceMap 객체의 값이 어떻게 변경되는지 한눈에 알아보기가 힘들다.
                - 물론 위 코드 정도라면 조금 시간을 들여보면 금방 분석이 가능하겠지만 해당 객체를 파라미터로 다른 메서드로 넘겨 또 set하고 또 set 한다면..? (상상만해도 끔찍하다.)
- Thread-Safe하여 병렬 프로그래밍에 유용하며, 동기화를 고려하지 않아도 된다.
    - 멀티 쓰레드 환경에서 가변 객체를 사용하게 되면 동시에 해당 객체의 수정이 빈번할 경우 해당 객체의 변경이 언제 어디서 일어날 수 있을지 예측하기 어렵다
- 가비지 컬렉션의 성능을 높일 수 있다.
    - 너무 Deep 한 내용으로 들어가므로 생략.. 하지만 보고 싶다면?
        - [https://mangkyu.tistory.com/131](https://mangkyu.tistory.com/131) 참고
- 가변 객체는 추론하기 어렵고 오용하기가 쉽다.

### **불변 객체 생성 예제**

- 가변 객체 사용
    - 예제 클래스
        
        ```java
        public class Student {
          private String name;
          private String title;
        
          public Student(String name, String title) {
            this.name = name;
            this.title = title;
          }
        
          public String getName() {
            return name;
          }
        
          public void setName(String name) {
            this.name = name;
          }
        
          public String getTitle() {
            return title;
          }
        
          public void setTitle(String title) {
            this.title = title;
          }
        }
        ```
        
    - 테스트 코드
        
        ```java
        @Test
          void 가변_객체_테스트() {
            Student student = new Student("김동현", "사원");
        
            System.out.println(" student = " + student);
        
            student.setName("이지봉");
            student.setTitle("파트장");
        
            System.out.println(" setter change student = " + student);
          }
        ```
        
    - 결과 값
        
        ```bash
        student = Student{name='김동현', title='사원'}
        setter change student = Student{name='이지봉', title='파트장'}
        ```
        
        - 객체 선언 후 해당 객체 필드가 변경이 가능한 상태이다. (Bad Code)

- 불변 객체 사용
    - 예제 클래스 (setter 제외)
        
        ```java
        public final class ImmutableStudent {
          private final String name;
          private final String title;
        
          public ImmutableStudent(String name, String title) {
            this.name = name;
            this.title = title;
          }
        
          public String getName() {
            return name;
          }
        
          public String getTitle() {
            return title;
          
        
        }
        ```
        
        - 모든 필드는 private 접근제어자로 생성한다.
        - class와 변수에 final 키워드를 작성함으로 한번 할당된 객체 및 필드는 변경되지 않는다.
        - setter가 없으므로 new 키워드를 통해 한번 생성된 객체는 변경할 수 없다.
        - 불변 객체 생성 완료 (Good Code)

- 불변 객체 사용2 - 빌더 패턴 적용
    - 예제 클래스 (빌더 적용 및 생성자 private)
        
        ```java
        public final class ImmutableStudent {
          private final String name;
          private final String title;
        
          // 생성자를 private으로 만들어 new 생성이 불가하게 한다.
          @Builder
          private ImmutableStudent(String name, String title) {
            this.name = name;
            this.title = title;
          }
        
          public String getName() {
            return name;
          }
        
          public String getTitle() {
            return title;
          }
        }
        ```
        
    - 테스트 코드
        
        ```java
        @Test
          void 불변_객체_테스트() {
        		// 컴파일 에러! 생성자가 private이므로 new 생성 자체가 불가
            ImmutableStudent student = new ImmutableStudent("김동현", "사원");
        
        		// 빌더 패턴으로만 객체 생성이 가능하다
        		ImmutableStudent student = ImmutableStudent.builder()
                .name("김동현")
                .title("사원")
                .build();
          }
        ```
        
        - 빌더 패턴은 해당 객체의 필드가 4~5개 이상 정도일 때 사용하는 것이 좋다.
        - 빌더 패턴을 통한 불변 객체 생성 완료 (Better Code)
    

- 불변 객체 사용3 - 정적 팩토리 메소드 패턴
    - 예제 클래스 (정적 팩토리 메소드로 객체 생성 가능)
        
        ```java
        public final class ImmutableStudent {
          private final String name;
          private final String title;
        
          // 생성자를 private으로 만들어 new 생성이 불가하게 한다.
          private ImmutableStudent(String name, String title) {
            this.name = name;
            this.title = title;
          }
        
          // 정적 팩토리 메서드를 통해 객체를 생성할 수 있다.
          public static ImmutableStudent of(String name, String title) {
            return new ImmutableStudent(name, title);
          }
          public static ImmutableStudent defaultTitleStudent(String name) {
            return new ImmutableStudent(name, "사원");
          }
        
          public String getName() {
            return name;
          }
        
          public String getTitle() {
            return title;
          }
        
          @Override
          public String toString() {
            return "ImmutableStudent{" +
                "name='" + name + '\'' +
                ", title='" + title + '\'' +
                '}';
          }
        }
        ```
        
    - 테스트 코드
        
        ```java
        @Test
          void 불변_객체_테스트() {
            ImmutableStudent studentA = ImmutableStudent.defaultTitleStudent("김동현");
            ImmutableStudent studentB = ImmutableStudent.of("이지봉", "파트장");
        
            System.out.println(" studentA = " + studentA);
            System.out.println(" studentB = " + studentB);
          }
        ```
        
        - 정적 팩토리 메서드 패턴을 통해 필드에 대한 기본값을 지정하고 특정 필드만 설정하거나 특정 필드에 대한 계산을 수행한 후 객체를 생성할 수 있다!
        - 정적 팩토리 메소드 패턴을 통한 불변 객체 생성 완료 (Better Code)

**빌더 패턴 vs 정적 팩토리 메소드 패턴**

- 빌더 패턴은 필드가 4~5개 이상 많은 클래스에 적용하면 좋다.
    - 많은 필드에 대한 객체 생성시 코드 가독성 향상
- 정적 팩토리 메소드 패턴은 필드가 4개 이하 정도인 클래스에 적용하면 좋다.
    - 적은 필드를 입맛에 맞게 직관적인 메소드명으로 객체 생성이 용이하여 코드 가독성 향상

java16 record 클래스를 사용하여 dto, vo와 같은 객체를 손쉽게 만들어 사용할 수 있다

 보일러 플레이트 코드 최소화

*클래스들은 가변적이여야 하는 매우 타당한 이유가 있지 않는 한 반드시 불변으로 만들어야 한다. 만약 클래스를 불변으로 만드는 것이 불가능하다면, 가능한 변경 가능성을 최소화하라.* 

*Effective Java -*

### 결합도 낮추기

- 다음 기회에..

# 재사용성

시간이 없어 다음 기회에…

### 제네릭 타입 사용

- 제네릭 타입을 사용하여 단일 타입만을 수용하는 메서드가 아닌 다양한 타입을 수용할 수 있는 메서드를 만들어 재사용성을 극대화

### 추상화

- 인터페이스에 의존하라
- 클래스 상속을 지양하라
- 다양한 디자인 패턴을 사용한 추상화
