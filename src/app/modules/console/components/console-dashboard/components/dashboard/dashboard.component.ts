import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { FirebaseDataService, SessionData, StudentSummary } from '../../../../../../services/firebase-data.service';
import { MatDialog } from '@angular/material/dialog';
import { StudentDetailComponent } from '../../../../../../components/student-detail/student-detail.component';
import { DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';

interface StudentProgress {
  studentId: string;
  session001Data?: StudentSummary;
  session002Data?: StudentSummary;
  hasSession001: boolean;
  hasSession002: boolean;
  hasBothSessions: boolean;
  progressStatus: 'improved' | 'declined' | 'same' | 'new' | 'incomplete';
}

interface ProgressStats {
  totalStudents: number;
  studentsInBothSessions: number;
  newStudentsInSession002: number;
  droppedStudentsFromSession001: number;
  improvedStudents: number;
  declinedStudents: number;
  samePerformance: number;
  averageProgressRate: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatPaginator,
    MatSort,
    NgIf,
    MatProgressSpinner,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    MatButton,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatExpansionModule,
    FormsModule,
    MatIconButton,
    DecimalPipe,
    MatTooltip
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['studentId', 'sessionNumber'];
  dataSource001 = new MatTableDataSource<StudentSummary>();
  dataSource002 = new MatTableDataSource<StudentSummary>();
  resultsLength001 = 0;
  resultsLength002 = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  selectedSession: string = 'all';

  // Debug properties
  debugInfo = {
    session001Loaded: false,
    session002Loaded: false,
    session001Count: 0,
    session002Count: 0,
    lastError: ''
  };

  private subscription: Subscription = new Subscription();
  studentProgressData: StudentProgress[] = [];
  progressStats: ProgressStats = {
    totalStudents: 0,
    studentsInBothSessions: 0,
    newStudentsInSession002: 0,
    droppedStudentsFromSession001: 0,
    improvedStudents: 0,
    declinedStudents: 0,
    samePerformance: 0,
    averageProgressRate: 0
  };
  progressDataSource = new MatTableDataSource<StudentProgress>();
  progressDisplayedColumns: string[] = ['studentId', 'session001Status', 'session002Status', 'progressStatus', 'actions'];
  showProgressSection = true;

  // Fixed ViewChild references with proper static configuration
  @ViewChild('progressPaginator', { static: false }) progressPaginator!: MatPaginator;
  @ViewChild('progressSort', { static: false }) progressSort!: MatSort;

  @ViewChild('paginator001', { static: false }) paginator001!: MatPaginator;
  @ViewChild('sort001', { static: false }) sort001!: MatSort;
  @ViewChild('paginator002', { static: false }) paginator002!: MatPaginator;
  @ViewChild('sort002', { static: false }) sort002!: MatSort;

  constructor(
    private firebaseDataService: FirebaseDataService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('Dashboard component initialized');
    this.loadData();
  }

  ngAfterViewInit() {
    console.log('AfterViewInit called');
    // Initial setup - will be called again when data is loaded
    this.setupAllPaginatorsAndSorts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setupAllPaginatorsAndSorts() {
    console.log('Setting up all paginators and sorts');
    this.setupSessionPaginatorsAndSort();
    this.setupProgressPaginator();
  }

  private setupSessionPaginatorsAndSort() {
    console.log('Setting up session paginators and sort');

    if (this.paginator001) {
      this.dataSource001.paginator = this.paginator001;
      console.log('Paginator001 connected');
    } else {
      console.log('Paginator001 not available');
    }

    if (this.sort001) {
      this.dataSource001.sort = this.sort001;
      console.log('Sort001 connected');
    } else {
      console.log('Sort001 not available');
    }

    if (this.paginator002) {
      this.dataSource002.paginator = this.paginator002;
      console.log('Paginator002 connected');
    } else {
      console.log('Paginator002 not available');
    }

    if (this.sort002) {
      this.dataSource002.sort = this.sort002;
      console.log('Sort002 connected');
    } else {
      console.log('Sort002 not available');
    }
  }

  private setupProgressPaginator() {
    console.log('Setting up progress paginator');

    // Only setup if progress section is visible and elements exist
    if (this.showProgressSection) {
      if (this.progressPaginator) {
        this.progressDataSource.paginator = this.progressPaginator;
        console.log('Progress Paginator connected');
      } else {
        console.log('Progress Paginator not available');
      }

      if (this.progressSort) {
        this.progressDataSource.sort = this.progressSort;
        console.log('Progress Sort connected');
      } else {
        console.log('Progress Sort not available');
      }
    }
  }

  loadData() {
    console.log('Starting to load data');
    this.isLoadingResults = true;
    this.isRateLimitReached = false;
    this.debugInfo.lastError = '';

    let completedRequests = 0;
    const totalRequests = 2;

    const checkAllLoaded = () => {
      completedRequests++;
      console.log(`Completed requests: ${completedRequests}/${totalRequests}`);

      if (completedRequests >= totalRequests) {
        this.isLoadingResults = false;
        console.log('All data loaded, analyzing progress and setting up paginators');

        // Analyze student progress first
        this.analyzeStudentProgress();

        // Force change detection
        this.cdr.detectChanges();

        // Setup paginators after data is loaded and DOM is updated
        setTimeout(() => {
          this.setupAllPaginatorsAndSorts();
          this.cdr.detectChanges();
        }, 100);
      }
    };

    // Load Session 001 data
    console.log('Subscribing to session 001 data');
    const sub001 = this.firebaseDataService.getUniqueStudentsBySession(1).subscribe({
      next: (data: StudentSummary[]) => {
        console.log('Session 001 data received:', data);
        this.debugInfo.session001Loaded = true;
        this.debugInfo.session001Count = data ? data.length : 0;

        if (data && Array.isArray(data)) {
          this.dataSource001.data = data;
          this.resultsLength001 = data.length;
          console.log(`Session 001: ${data.length} records loaded`);
        } else {
          console.warn('Session 001 data is not an array:', data);
          this.dataSource001.data = [];
          this.resultsLength001 = 0;
        }

        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error loading session 001:', error);
        this.debugInfo.lastError = `Session 001 error: ${error.message || error}`;
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        this.cdr.detectChanges();
      }
    });

    // Load Session 002 data
    console.log('Subscribing to session 002 data');
    const sub002 = this.firebaseDataService.getUniqueStudentsBySession(2).subscribe({
      next: (data: StudentSummary[]) => {
        console.log('Session 002 data received:', data);
        this.debugInfo.session002Loaded = true;
        this.debugInfo.session002Count = data ? data.length : 0;

        if (data && Array.isArray(data)) {
          this.dataSource002.data = data;
          this.resultsLength002 = data.length;
          console.log(`Session 002: ${data.length} records loaded`);
        } else {
          console.warn('Session 002 data is not an array:', data);
          this.dataSource002.data = [];
          this.resultsLength002 = 0;
        }

        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error loading session 002:', error);
        this.debugInfo.lastError = `Session 002 error: ${error.message || error}`;
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        this.cdr.detectChanges();
      }
    });

    this.subscription.add(sub001);
    this.subscription.add(sub002);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource001.filter = filterValue.trim().toLowerCase();
    this.dataSource002.filter = filterValue.trim().toLowerCase();

    if (this.dataSource001.paginator) {
      this.dataSource001.paginator.firstPage();
    }
    if (this.dataSource002.paginator) {
      this.dataSource002.paginator.firstPage();
    }
  }

  filterBySession() {
    this.cdr.detectChanges();
    if (this.dataSource001.paginator) {
      this.dataSource001.paginator.firstPage();
    }
    if (this.dataSource002.paginator) {
      this.dataSource002.paginator.firstPage();
    }
  }

  clearFilters() {
    this.selectedSession = 'all';
    this.dataSource001.filter = '';
    this.dataSource002.filter = '';
    if (this.dataSource001.paginator) {
      this.dataSource001.paginator.firstPage();
    }
    if (this.dataSource002.paginator) {
      this.dataSource002.paginator.firstPage();
    }
    this.cdr.detectChanges();
  }

  exportData() {
    const data = [
      ...this.dataSource001.data.map(item => ({ ...item, session: '001' })),
      ...this.dataSource002.data.map(item => ({ ...item, session: '002' }))
    ];

    const csv = [
      'Student ID,Session Number',
      ...data.map(item => `${item.studentId},${item.sessionNumber}`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_sessions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  refreshData() {
    console.log('Manual refresh triggered');
    this.loadData();
  }

  formatTimestamp(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }

  formatAttention(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  openDialog(studentId: string, sessionNumber: number): void {
    const dialogRef = this.dialog.open(StudentDetailComponent, {
      minWidth: '95vw',
      data: { studentId, sessionNumber }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  private analyzeStudentProgress() {
    console.log('Analyzing student progress...');

    // Create a map of all unique students
    const studentMap = new Map<string, StudentProgress>();

    // Process Session 001 students
    this.dataSource001.data.forEach(student => {
      if (!studentMap.has(student.studentId)) {
        studentMap.set(student.studentId, {
          studentId: student.studentId,
          session001Data: student,
          hasSession001: true,
          hasSession002: false,
          hasBothSessions: false,
          progressStatus: 'incomplete'
        });
      }
    });

    // Process Session 002 students
    this.dataSource002.data.forEach(student => {
      if (studentMap.has(student.studentId)) {
        const existing = studentMap.get(student.studentId)!;
        existing.session002Data = student;
        existing.hasSession002 = true;
        existing.hasBothSessions = true;
        existing.progressStatus = this.calculateProgressStatus(existing.session001Data!, student);
      } else {
        studentMap.set(student.studentId, {
          studentId: student.studentId,
          session002Data: student,
          hasSession001: false,
          hasSession002: true,
          hasBothSessions: false,
          progressStatus: 'new'
        });
      }
    });

    this.studentProgressData = Array.from(studentMap.values());
    this.progressDataSource.data = this.studentProgressData;

    // Calculate statistics
    this.calculateProgressStats();

    console.log('Progress analysis complete:', this.progressStats);
  }

  private calculateProgressStatus(session001: StudentSummary, session002: StudentSummary): 'improved' | 'declined' | 'same' {
    // Placeholder logic - replace with actual comparison metrics
    const session001Score = this.getStudentScore(session001);
    const session002Score = this.getStudentScore(session002);

    if (session002Score > session001Score) {
      return 'improved';
    } else if (session002Score < session001Score) {
      return 'declined';
    } else {
      return 'same';
    }
  }

  private getStudentScore(student: StudentSummary): number {
    // Placeholder scoring logic - replace with actual metrics from your StudentSummary
    return Math.random() * 100; // Replace with actual calculation
  }

  private calculateProgressStats() {
    const stats = this.progressStats;
    stats.totalStudents = this.studentProgressData.length;
    stats.studentsInBothSessions = this.studentProgressData.filter(s => s.hasBothSessions).length;
    stats.newStudentsInSession002 = this.studentProgressData.filter(s => s.progressStatus === 'new').length;
    stats.droppedStudentsFromSession001 = this.studentProgressData.filter(s => s.hasSession001 && !s.hasSession002).length;
    stats.improvedStudents = this.studentProgressData.filter(s => s.progressStatus === 'improved').length;
    stats.declinedStudents = this.studentProgressData.filter(s => s.progressStatus === 'declined').length;
    stats.samePerformance = this.studentProgressData.filter(s => s.progressStatus === 'same').length;

    // Calculate average progress rate
    const studentsWithBothSessions = this.studentProgressData.filter(s => s.hasBothSessions);
    if (studentsWithBothSessions.length > 0) {
      stats.averageProgressRate = (stats.improvedStudents / studentsWithBothSessions.length) * 100;
    }
  }

  toggleProgressSection() {
    this.showProgressSection = !this.showProgressSection;
    this.cdr.detectChanges();

    if (this.showProgressSection) {
      // Give Angular time to render the elements before setting up pagination
      setTimeout(() => {
        this.setupProgressPaginator();
        this.cdr.detectChanges();
      }, 200);
    }
  }

  getProgressStatusIcon(status: string): string {
    switch (status) {
      case 'improved': return 'trending_up';
      case 'declined': return 'trending_down';
      case 'same': return 'trending_flat';
      case 'new': return 'person_add';
      case 'incomplete': return 'help_outline';
      default: return 'help_outline';
    }
  }

  getProgressStatusColor(status: string): string {
    switch (status) {
      case 'improved': return 'success';
      case 'declined': return 'warn';
      case 'same': return 'accent';
      case 'new': return 'primary';
      case 'incomplete': return '';
      default: return '';
    }
  }

  getProgressStatusText(status: string): string {
    switch (status) {
      case 'improved': return 'Improved';
      case 'declined': return 'Declined';
      case 'same': return 'Same';
      case 'new': return 'New Student';
      case 'incomplete': return 'Missing Session';
      default: return status;
    }
  }

  applyProgressFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.progressDataSource.filter = filterValue.trim().toLowerCase();

    if (this.progressDataSource.paginator) {
      this.progressDataSource.paginator.firstPage();
    }
  }

  openProgressDialog(studentId: string): void {
    const student = this.studentProgressData.find(s => s.studentId === studentId);
    if (student) {
      const dialogRef = this.dialog.open(StudentDetailComponent, {
        minWidth: '95vw',
        data: {
          studentId,
          sessionNumber: student.hasSession002 ? 2 : 1,
          progressData: student
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Progress dialog was closed');
      });
    }
  }
}
