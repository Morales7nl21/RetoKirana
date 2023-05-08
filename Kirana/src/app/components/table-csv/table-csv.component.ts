import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UpCsvService } from 'src/app/services/web_services/up-csv.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-table-csv',
  templateUrl: './table-csv.component.html',
  styleUrls: ['./table-csv.component.css'],
})
export class TableCSVComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any;
  headerColumnas: string[] = ['Nombre', 'Correo Electronico', 'Telefono'];
  constructor(private upCsvService: UpCsvService) {}
  reload() {
    window.location.reload();
  }
  ngOnInit(): void {
    this.upCsvService.resultApi?.subscribe({
      next: (response: any) => {
        if (Object.keys(response).includes('error')) {
          swal.fire({
            icon: 'error',
            text: `${Object.values(response)}`,
            heightAuto: false,
          }).then((result)=>{
            if (result.isConfirmed) {
              window.location.reload();
            }
          });

        } else {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.sort = this.sort;
          this.paginator._intl.itemsPerPageLabel = 'Página';
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (response: any) => {
        swal.fire({
          icon: 'error',
          text: `${response}`,
          heightAuto: false,
        });
        window.location.reload();
      },
    });
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro;
  }

  sortData(sort: Sort) {
    const orderData = this.dataSource.slice();
    if (!sort.active || sort.direction === '') {
      this.sortData = orderData;
    }
  }
}
